import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { VideoEngine } from './video-engine';

let mainWindow: BrowserWindow | null = null;
let videoEngine: VideoEngine | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    title: 'StageFlow Player',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.webContents.openDevTools({ mode: 'right' });
}

app.whenReady().then(() => {
  videoEngine = new VideoEngine();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (videoEngine) {
    videoEngine.dispose();
  }
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('player:load', async (_event, filePath: string) => {
  if (!videoEngine) throw new Error('video engine not ready');
  return videoEngine.load(filePath);
});

ipcMain.handle('player:play', async () => {
  if (!videoEngine) throw new Error('video engine not ready');
  return videoEngine.play();
});

ipcMain.handle('player:pause', async () => {
  if (!videoEngine) throw new Error('video engine not ready');
  return videoEngine.pause();
});

ipcMain.handle('player:stop', async () => {
  if (!videoEngine) throw new Error('video engine not ready');
  return videoEngine.stop();
});

ipcMain.handle('player:seek', async (_event, seconds: number) => {
  if (!videoEngine) throw new Error('video engine not ready');
  return videoEngine.seek(seconds);
});

ipcMain.handle('player:state', async () => {
  if (!videoEngine) throw new Error('video engine not ready');
  return videoEngine.getState();
});
