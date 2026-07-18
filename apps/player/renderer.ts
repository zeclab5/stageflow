export {};

declare global {
  interface Window {
    stageflowPlayer: {
      open: () => Promise<{ canceled: boolean; state?: any }>;
      play: () => Promise<any>;
      pause: () => Promise<any>;
      stop: () => Promise<any>;
      seek: (seconds: number) => Promise<any>;
      state: () => Promise<any>;
      loadCues: (projectId: string, sceneId: string) => Promise<any[]>;
      playCue: (index: number) => Promise<any>;
      stopCue: () => Promise<any>;
    };
  }
}

const fileInput = document.getElementById('file-input') as HTMLInputElement | null;
const video = document.getElementById('video') as HTMLVideoElement | null;
const playBtn = document.getElementById('play-btn') as HTMLButtonElement | null;
const pauseBtn = document.getElementById('pause-btn') as HTMLButtonElement | null;
const stopBtn = document.getElementById('stop-btn') as HTMLButtonElement | null;
const openFileBtn = document.getElementById('open-file-btn') as HTMLButtonElement | null;
const timeEl = document.getElementById('time') as HTMLSpanElement | null;
const statusEl = document.getElementById('status') as HTMLSpanElement | null;

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTime() {
  if (!video || !timeEl) return;
  const current = formatTime(video.currentTime);
  const total = formatTime(video.duration || 0);
  timeEl.textContent = `${current} / ${total}`;
}

async function loadFile() {
  const result = await window.stageflowPlayer.open();
  if (result.canceled || !result.state?.path) return;
  if (video) {
    video.src = result.state.path;
  }
  if (statusEl) statusEl.textContent = 'Loaded';
  updateTime();
}

async function play() {
  if (!video) return;
  await video.play();
  if (statusEl) statusEl.textContent = 'Playing';
}

async function pause() {
  if (!video) return;
  await video.pause();
  if (statusEl) statusEl.textContent = 'Paused';
}

function stop() {
  if (!video) return;
  video.pause();
  video.currentTime = 0;
  if (statusEl) statusEl.textContent = 'Stopped';
  updateTime();
}

if (fileInput) {
  fileInput.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    if (video) video.src = URL.createObjectURL(file);
    if (statusEl) statusEl.textContent = 'Loaded: ' + file.name;
    updateTime();
  });
}

if (openFileBtn) openFileBtn.addEventListener('click', loadFile);
if (playBtn) playBtn.addEventListener('click', play);
if (pauseBtn) pauseBtn.addEventListener('click', pause);
if (stopBtn) stopBtn.addEventListener('click', stop);

if (video) {
  video.addEventListener('timeupdate', updateTime);
  video.addEventListener('loadedmetadata', updateTime);
}
