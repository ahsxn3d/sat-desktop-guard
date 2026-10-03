const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');
const { FocusGuardService } = require('./guardService');

let mainWindow = null;
let splashWindow = null;
let nextDevProcess = null;
const guardService = new FocusGuardService();

const TARGET_PORT = 3000;
const START_URL = process.env.ELECTRON_START_URL || http://localhost:;

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 500,
    height: 380,
    transparent: true,
    backgroundColor: '#00000000',
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    center: true,
    show: false,
    hasShadow: false,
    icon: path.join(__dirname, '../public/favicon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  splashWindow.loadFile(path.join(__dirname, 'splash.html'));
  splashWindow.once('ready-to-show', () => {
    splashWindow.show();
  });
}

function checkPortReady(port, callback) {
  const req = http.request({
    host: '127.0.0.1',
    port: port,
    path: '/',
    method: 'HEAD',
    timeout: 1500,
  }, (res) => {
    callback(true);
  });

  req.on('error', () => {
    callback(false);
  });

  req.on('timeout', () => {
    req.destroy();
    callback(false);
  });

  req.end();
}

function ensureDevServer(onReady) {
  checkPortReady(TARGET_PORT, (ready) => {
    if (ready) {
      console.log([Electron] Port  is already alive. Connecting...);
      onReady();
      return;
    }

    console.log([Electron] Port  not active. Spawning next dev server...);
    const projectRoot = path.join(__dirname, '..');
    
    // Start Next.js in background
    nextDevProcess = spawn('npm.cmd', ['run', 'dev'], {
      cwd: projectRoot,
      shell: true,
      stdio: 'ignore',
      detached: false,
    });

    // Poll until ready
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      checkPortReady(TARGET_PORT, (isUp) => {
        if (isUp || attempts > 45) {
          clearInterval(interval);
          onReady();
        }
      });
    }, 1000);
  });
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1024,
    minHeight: 700,
    backgroundColor: '#071521',
    title: 'SAT Focus Guard - The Anti-Burnout Desktop Rulebook',
    icon: path.join(__dirname, '../public/favicon.ico'),
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
    autoHideMenuBar: true,
  });

  // Guard navigation so all app pages stay inside the native Electron window!
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // If it is localhost, open in the same window
    if (url.startsWith('http://localhost:3000') || url.startsWith('http://127.0.0.1:3000')) {
      mainWindow.loadURL(url);
      return { action: 'deny' };
    }
    // External links can be handled safely
    return { action: 'allow' };
  });

  let loaded = false;
  const loadPage = () => {
    mainWindow.loadURL(START_URL);
  };

  mainWindow.webContents.on('did-fail-load', () => {
    if (!loaded) {
      setTimeout(loadPage, 1000);
    }
  });

  mainWindow.webContents.on('did-finish-load', () => {
    if (!loaded) {
      loaded = true;
      setTimeout(() => {
        if (splashWindow && !splashWindow.isDestroyed()) {
          splashWindow.close();
        }
        mainWindow.show();
        mainWindow.focus();
      }, 600);
    }
  });

  loadPage();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createSplashWindow();

  ensureDevServer(() => {
    createMainWindow();
    guardService.init(mainWindow);
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  guardService.emergencyCleanup();
  if (nextDevProcess) {
    try {
      process.kill(-nextDevProcess.pid);
    } catch (e) {}
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

process.on('SIGINT', () => {
  guardService.emergencyCleanup();
  process.exit();
});
process.on('SIGTERM', () => {
  guardService.emergencyCleanup();
  process.exit();
});

// IPC Communication with React UI
ipcMain.handle('guard:get-status', async () => {
  return guardService.getStatus();
});

ipcMain.handle('guard:start-lock', async (event, config) => {
  return guardService.startLock(config);
});

ipcMain.handle('guard:stop-lock', async (event, reason) => {
  return guardService.stopLock(reason);
});

ipcMain.handle('guard:save-config', async (event, config) => {
  return guardService.saveConfig(config);
});

ipcMain.handle('guard:get-running-processes', async () => {
  return guardService.getRunningProcesses();
});
