const fileInput = document.getElementById('file-input') as HTMLInputElement;
const video = document.getElementById('video') as HTMLVideoElement;
const playBtn = document.getElementById('play-btn') as HTMLButtonElement;
const pauseBtn = document.getElementById('pause-btn') as HTMLButtonElement;
const stopBtn = document.getElementById('stop-btn') as HTMLButtonElement;
const timeEl = document.getElementById('time') as HTMLSpanElement;
const statusEl = document.getElementById('status') as HTMLSpanElement;

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTime() {
  const current = formatTime(video.currentTime);
  const total = formatTime(video.duration || 0);
  timeEl.textContent = `${current} / ${total}`;
}

fileInput.addEventListener('change', async () => {
  const file = fileInput.files?.[0];
  if (!file) return;
  
  const filePath = file.path || URL.createObjectURL(file);
  video.src = filePath;
  statusEl.textContent = 'Loaded: ' + file.name;
  updateTime();
});

playBtn.addEventListener('click', async () => {
  await video.play();
  statusEl.textContent = 'Playing';
});

pauseBtn.addEventListener('click', async () => {
  await video.pause();
  statusEl.textContent = 'Paused';
});

stopBtn.addEventListener('click', () => {
  video.pause();
  video.currentTime = 0;
  statusEl.textContent = 'Stopped';
  updateTime();
});

video.addEventListener('timeupdate', updateTime);
video.addEventListener('loadedmetadata', updateTime);
