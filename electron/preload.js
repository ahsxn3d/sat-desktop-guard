const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopGuard', {
  isDesktop: true,
  getStatus: () => ipcRenderer.invoke('guard:get-status'),
  startLock: (config) => ipcRenderer.invoke('guard:start-lock', config),
  stopLock: (reason) => ipcRenderer.invoke('guard:stop-lock', reason),
  saveConfig: (config) => ipcRenderer.invoke('guard:save-config', config),
  getRunningProcesses: () => ipcRenderer.invoke('guard:get-running-processes'),
  onGuardUpdate: (callback) => {
    const handler = (event, data) => callback(data);
    ipcRenderer.on('guard:update', handler);
    return () => ipcRenderer.removeListener('guard:update', handler);
  },
  onProcessBlocked: (callback) => {
    const handler = (event, data) => callback(data);
    ipcRenderer.on('guard:process-blocked', handler);
    return () => ipcRenderer.removeListener('guard:process-blocked', handler);
  }
});
