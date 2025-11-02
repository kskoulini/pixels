const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('pixels', {
  minimize: () => ipcRenderer.send('window:minimize'),
  close:    () => ipcRenderer.send('window:close')
});