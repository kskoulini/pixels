const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 300,
    height: 400,
    resizable: false,
    backgroundColor: '#f6f0e5',
    frame: false,                   // Disable the default frame
    // titleBarStyle: 'hidden',
    // titleBarOverlay: { color: '#f6f0e5', symbolColor: '#3a2f26', height: 36 },
    icon: path.join(__dirname, 'public', 'favicon.svg'), // Path to your app icon  
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });

  const url = process.env.ELECTRON_START_URL || 'http://localhost:3000';
  win.loadURL(url);
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.on('window:minimize', () => BrowserWindow.getFocusedWindow()?.minimize());
  ipcMain.on('window:close', () => BrowserWindow.getFocusedWindow()?.close());

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
