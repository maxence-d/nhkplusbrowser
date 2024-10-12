const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  scrapePage: () => ipcRenderer.invoke('scrape-page')
});
