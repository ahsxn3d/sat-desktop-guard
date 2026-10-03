const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { FocusGuardService } = require('./guardService');

let mainWindow = null;
const guardService = new FocusGuardService();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    backgroundColor: '#071521',
    title: 'SAT Focus Guard - The Anti-Burnout Desktop Rulebook',
    icon: path.join(__dirname, '../public/icon.png'),
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

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  // Initialize guard service with window reference to send live events
  guardService.init(mainWindow);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Always clean up blocking state (e.g. hosts file restore) before closing
  guardService.emergencyCleanup();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Clean up if process exits abruptly
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
