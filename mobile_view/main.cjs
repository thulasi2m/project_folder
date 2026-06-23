const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV !== 'production';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 430, // iPhone Pro Max width to maintain the mobile view
    height: 932,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    autoHideMenuBar: true, // Hide file/edit menus for a cleaner app look
    resizable: false, // Keep it mobile-sized
    title: "Cherry Precision Air Gauge"
  });

  if (isDev) {
    // In development mode, load the Vite server
    mainWindow.loadURL('http://localhost:5175');
  } else {
    // In production mode, load the built index.html from dist
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
