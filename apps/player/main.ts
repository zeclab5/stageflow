import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import { VideoEngine } from './video-engine';
import { PlayerController } from './player-controller';

let mainWindow: BrowserWindow | null = null;
let engine: VideoEngine | null = null;
let controller: PlayerController | null = null;

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
  engine = new VideoEngine();
  controller = new PlayerController();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (engine) {
    engine.dispose();
  }
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('player:open', async () => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openFile'],
    filters: [{ name: 'Video', extensions: ['mp4', 'mov', 'mkv', 'avi'] }],
  });
  if (result.canceled || !result.filePaths[0]) return { canceled: true };
  const state = await engine!.load(result.filePaths[0]);
  return { canceled: false, state };
});

ipcMain.handle('player:play', async () => {
  const state = await engine!.play();
  return state;
});

ipcMain.handle('player:pause', async () => {
  const state = await engine!.pause();
  return state;
});

ipcMain.handle('player:stop', async () => {
  const state = await engine!.stop();
  return state;
});

ipcMain.handle('player:seek', async (_event, seconds: number) => {
  const state = await engine!.seek(seconds);
  return state;
});

ipcMain.handle('player:state', async () => {
  return engine!.getState();
});

ipcMain.handle('player:load-cues', async (_event, projectId: string, sceneId: string) => {
  const cues = await controller!.loadCues(projectId, sceneId);
  return cues;
});

ipcMain.handle('player:play-cue', async (_event, index: number) => {
  return controller!.playCue(index);
});

ipcMain.handle('player:stop-cue', async () => {
  return controller!.stopCurrent();
});
