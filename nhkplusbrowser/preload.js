const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (channel, data, state) => {
    // whitelist channels
    const validChannels = ['update-checkbox-state', 'reorder-cbs', 'open-external-link'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data, state);
    }
  }
});
