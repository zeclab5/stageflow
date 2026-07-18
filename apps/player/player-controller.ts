import { VideoEngine } from './video-engine';

export type Cue = {
  id: string;
  name: string;
  sceneId: string;
  timelinePosition: number;
  timelineDuration: number;
};

export type PlayerState = {
  status: 'idle' | 'ready' | 'playing' | 'paused';
  path?: string;
  duration?: number;
  currentTime?: number;
};

export class PlayerController {
  private readonly apiBase = process.env.STAGEFLOW_API_BASE ?? 'http://localhost:3101';
  private readonly apiKey = process.env.STAGEFLOW_API_KEY;
  private cues: Cue[] = [];
  private currentIndex = -1;
  private engine = new VideoEngine();

  private authHeaders() {
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (this.apiKey) headers['x-api-key'] = this.apiKey;
    return headers;
  }

  async loadCues(projectId: string, sceneId: string): Promise<Cue[]> {
    const url = `${this.apiBase}/projects/${projectId}/scenes/${sceneId}/cues`;
    const response = await fetch(url, {
      headers: this.authHeaders(),
    });
    if (!response.ok) throw new Error(`load cues failed: ${response.status}`);
    const items = (await response.json()) as Cue[];
    this.cues = items.sort((a, b) => a.timelinePosition - b.timelinePosition);
    return this.cues;
  }

  async playCue(index: number): Promise<PlayerState> {
    if (index < 0 || index >= this.cues.length) throw new Error('cue index out of range');
    const cue = this.cues[index];
    this.currentIndex = index;
    const state = await this.engine.load(cuePathFromCue(cue));
    return this.engine.play().then((playing) => ({ ...state, ...playing }));
  }

  async stopCurrent(): Promise<PlayerState> {
    return this.engine.stop();
  }

  getState(): PlayerState {
    return this.engine.getState();
  }
}

function cuePathFromCue(cue: Cue): string {
  return `/Users/jangjaeho/zeclab/StageFlow/public/content/${cue.sceneId}/${cue.id}.mp4`;
}
