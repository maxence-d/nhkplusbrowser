const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const onScrape = require('./scrape');

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,  // This will make the window invisible
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    }
  })

  mainWindow.loadFile('index.html')
}

// Handle the 'scrape-page' event from the renderer process
ipcMain.handle('scrape-page', () => onScrape(mainWindow));  // Use the handler

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
