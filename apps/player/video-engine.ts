export type PlayerState = {
  status: 'idle' | 'ready' | 'playing' | 'paused';
  path?: string;
  duration?: number;
  currentTime?: number;
};

export class VideoEngine {
  private ffmpeg: any;
  private filePath?: string;
  private state: PlayerState = { status: 'idle' };

  async load(filePath: string): Promise<PlayerState> {
    this.filePath = filePath;
    return new Promise((resolve, reject) => {
      const ffmpeg = require('fluent-ffmpeg');
      ffmpeg.ffprobe(filePath, (err: Error, metadata: any) => {
        if (err) {
          reject(err);
          return;
        }
        this.state = {
          status: 'ready',
          path: filePath,
          duration: metadata.format.duration,
          currentTime: 0,
        };
        resolve(this.state);
      });
    });
  }

  async play(): Promise<PlayerState> {
    if (!this.filePath) throw new Error('no file loaded');
    if (!this.ffmpeg) {
      this.ffmpeg = require('fluent-ffmpeg');
    }
    // 실제 비디오 출력은 나중에 구현
    this.state = { ...this.state, status: 'playing' };
    return this.state;
  }

  async pause(): Promise<PlayerState> {
    this.state = { ...this.state, status: 'paused' };
    return this.state;
  }

  async stop(): Promise<PlayerState> {
    this.state = { status: 'idle' };
    return this.state;
  }

  async seek(seconds: number): Promise<PlayerState> {
    if (!this.filePath) throw new Error('no file loaded');
    this.state = { ...this.state, currentTime: seconds };
    return this.state;
  }

  getState(): PlayerState {
    return this.state;
  }

  async dispose(): Promise<void> {
    await this.stop();
  }
}
