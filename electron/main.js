const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { FocusGuardService } = require('./guardService');

let mainWindow = null;
let splashWindow = null;
const guardService = new FocusGuardService();

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 480,
    height: 340,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    center: true,
    show: false,
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

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
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

  const startUrl = process.env.ELECTRON_START_URL || 'http://localhost:3000';
  mainWindow.loadURL(startUrl);

  mainWindow.once('ready-to-show', () => {
    // Smooth transition from splash to main window
    setTimeout(() => {
      if (splashWindow && !splashWindow.isDestroyed()) {
        splashWindow.close();
      }
      mainWindow.show();
      mainWindow.focus();
    }, 1200);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createSplashWindow();
  createMainWindow();

  guardService.init(mainWindow);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  guardService.emergencyCleanup();
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
