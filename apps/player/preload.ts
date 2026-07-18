const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  loadVideo: (filePath: string) => ipcRenderer.invoke('player:load', filePath),
  play: () => ipcRenderer.invoke('player:play'),
  pause: () => ipcRenderer.invoke('player:pause'),
  stop: () => ipcRenderer.invoke('player:stop'),
  seek: (seconds: number) => ipcRenderer.invoke('player:seek', seconds),
  getState: () => ipcRenderer.invoke('player:state'),
});
