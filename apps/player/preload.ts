const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('stageflowPlayer', {
  open: () => ipcRenderer.invoke('player:open'),
  play: () => ipcRenderer.invoke('player:play'),
  pause: () => ipcRenderer.invoke('player:pause'),
  stop: () => ipcRenderer.invoke('player:stop'),
  seek: (seconds: number) => ipcRenderer.invoke('player:seek', seconds),
  state: () => ipcRenderer.invoke('player:state'),
  loadCues: (projectId: string, sceneId: string) => ipcRenderer.invoke('player:load-cues', projectId, sceneId),
  playCue: (index: number) => ipcRenderer.invoke('player:play-cue', index),
  stopCue: () => ipcRenderer.invoke('player:stop-cue'),
});
