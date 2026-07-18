import { Plugin, PluginConfig, PluginDescriptor } from 'stageflow-core';

export type Composition = {
  id: string;
  name?: string;
};

export type Layer = {
  id: string;
  index: number;
  name?: string;
  video?: boolean;
  audio?: boolean;
  width?: number;
  height?: number;
};

export type Clip = {
  id: string;
  name?: string;
  type?: string;
  video?: boolean;
  audio?: boolean;
  path?: string;
  src?: string;
  visible?: boolean;
  playing?: boolean;
  currentTime?: number;
  duration?: number;
  loop?: boolean;
  speed?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
  opacity?: number;
  volume?: number;
  muted?: boolean;
  transitionInEnabled?: boolean;
  transitionInDuration?: number;
  transitionOutEnabled?: boolean;
  transitionOutDuration?: number;
};

export interface ResolumePluginOptions {
  readonly host?: string;
  readonly port?: number;
  readonly baseUrl?: string;
  readonly name?: string;
  readonly mode?: 'rest' | 'osc' | 'websocket';
}

export class ResolumePlugin implements Plugin {
  readonly name: string;
  private readonly baseUrl: string;
  private readonly mode: 'rest' | 'osc' | 'websocket';

  constructor(options: ResolumePluginOptions = {}) {
    const host = options.host ?? '127.0.0.1';
    const port = options.port ?? 8080;
    this.baseUrl = options.baseUrl ?? `http://${host}:${port}/api/v1`;
    this.mode = options.mode ?? 'rest';
    this.name = options.name ?? 'resolume';
  }

  async init(): Promise<void> {
    const status = await this.status();
    if (!status.startsWith('status=ok')) {
      throw new Error(`resolume not ready: ${status}`);
    }
  }

  async shutdown(): Promise<void> {
    console.log('resolume plugin shutdown');
  }

  async status(): Promise<string> {
    if (this.mode !== 'rest') {
      const transport = this.mode === 'websocket' ? 'websocket' : 'osc';
      return `status=ok;mode=${transport};baseUrl=${this.baseUrl}`;
    }
    try {
      const res = await fetch(`${this.baseUrl}/composition/list_composition`, { signal: AbortSignal.timeout(2000) });
      return `status=ok;http=${res.status}`;
    } catch (err) {
      return `failed=${String(err).slice(0, 120)}`;
    }
  }

  connect() {
    return this.baseUrl;
  }

  async findCompositions(): Promise<Composition[]> {
    if (this.mode !== 'rest') {
      return [{ id: 'demo', name: 'Demo Mode' }];
    }
    const res = await fetch(`${this.baseUrl}/composition/list_composition`);
    if (!res.ok) throw new Error(`list compositions failed: ${res.status}`);
    const json = (await res.json()) as unknown[];
    return json.map((item: any) => ({
      id: String(item?.id ?? item?.compositionId ?? item?.name ?? 'unknown'),
      name: item?.name ?? item?.fileName,
    }));
  }

  async activateComposition(compositionId: string): Promise<{ compositionId: string; ok: boolean }> {
    if (this.mode !== 'rest') {
      return { compositionId, ok: true };
    }
    const res = await fetch(`${this.baseUrl}/composition/select/${encodeURIComponent(compositionId)}`, { method: 'POST' });
    if (!res.ok) throw new Error(`activate composition failed: ${res.status}`);
    const json = await res.json();
    return { compositionId, ok: Boolean(json) };
  }

  async getRenderTree(compositionId: string): Promise<{ compositionId: string; layers: Layer[]; clips: Clip[][] }> {
    if (this.mode !== 'rest') {
      return { compositionId, layers: [], clips: [] };
    }
    const res = await fetch(`${this.baseUrl}/composition/get/${encodeURIComponent(compositionId)}`);
    if (!res.ok) throw new Error(`get composition failed: ${res.status}`);
    const json = await res.json();
    const layers: Layer[] = (json?.layers ?? json?.data?.layers ?? []).map((layer: any, index: number) => ({
      id: String(layer?.id ?? layer?.name ?? `layer-${index}`),
      index,
      name: layer?.name,
      video: layer?.video,
      audio: layer?.audio,
      width: layer?.width,
      height: layer?.height,
    }));
    const clips: Clip[][] = (json?.clips ?? json?.data?.clips ?? layers.map(() => [])).map((layerClips: any) =>
      Array.isArray(layerClips)
        ? layerClips.map((clip: any) => toClip(clip))
        : [toClip(layerClips)]
    );
    return { compositionId, layers, clips };
  }

  async loadVideoToClip(compositionId: string, layerId: string, clipId: string, videoPath: string): Promise<{ currentVideoClip: Clip }> {
    if (this.mode !== 'rest') {
      const dummy: Clip = { id: clipId, path: videoPath, src: videoPath, type: 'video', video: true, playing: false };
      return { currentVideoClip: dummy };
    }
    const res = await fetch(
      `${this.baseUrl}/composition/set_source_clip/${encodeURIComponent(compositionId)}/${encodeURIComponent(layerId)}/${encodeURIComponent(clipId)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: videoPath }),
      }
    );
    if (!res.ok) throw new Error(`load video failed: ${res.status}`);
    const json = await res.json();
    return { currentVideoClip: toClip({ ...(json?.clip ?? {}), path: videoPath, src: videoPath, type: 'video', video: true }) };
  }

  async playClip(compositionId: string, layerId: string, clipId: string): Promise<{ playing: boolean; playmode: string }> {
    if (this.mode !== 'rest') {
      return { playing: true, playmode: 'play' };
    }
    const res = await fetch(
      `${this.baseUrl}/composition/play_clip/${encodeURIComponent(compositionId)}/${encodeURIComponent(layerId)}/${encodeURIComponent(clipId)}`,
      { method: 'POST' }
    );
    if (!res.ok) throw new Error(`play clip failed: ${res.status}`);
    const json = await res.json();
    return { playing: Boolean(json?.playing ?? true), playmode: String(json?.playmode ?? 'play') };
  }

  async stopClip(compositionId: string, layerId: string, clipId: string): Promise<{ playing: boolean; playmode: string }> {
    if (this.mode !== 'rest') {
      return { playing: false, playmode: 'stop' };
    }
    const res = await fetch(
      `${this.baseUrl}/composition/stop_clip/${encodeURIComponent(compositionId)}/${encodeURIComponent(layerId)}/${encodeURIComponent(clipId)}`,
      { method: 'POST' }
    );
    if (!res.ok) throw new Error(`stop clip failed: ${res.status}`);
    const json = await res.json();
    return { playing: Boolean(json?.playing ?? false), playmode: String(json?.playmode ?? 'stop') };
  }

  async toggleClipPlayback(compositionId: string, layerId: string, clipId: string, play: boolean): Promise<{ playing: boolean; playmode: string }> {
    return play
      ? this.playClip(compositionId, layerId, clipId)
      : this.stopClip(compositionId, layerId, clipId);
  }

  async setClipTransform(compositionId: string, layerId: string, clipId: string, transform: { x?: number; y?: number; width?: number; height?: number; rotation?: number; opacity?: number }): Promise<{ transformed: boolean }> {
    if (this.mode !== 'rest') {
      return { transformed: true };
    }
    const res = await fetch(
      `${this.baseUrl}/composition/set_clip_property/${encodeURIComponent(compositionId)}/${encodeURIComponent(layerId)}/${encodeURIComponent(clipId)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transform),
      }
    );
    if (!res.ok) throw new Error(`set transform failed: ${res.status}`);
    return { transformed: true };
  }

  async setClipSpeed(compositionId: string, layerId: string, clipId: string, speed: number): Promise<{ speed: number }> {
    if (this.mode !== 'rest') {
      return { speed };
    }
    const res = await fetch(
      `${this.baseUrl}/composition/set_clip_property/${encodeURIComponent(compositionId)}/${encodeURIComponent(layerId)}/${encodeURIComponent(clipId)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ speed }),
      }
    );
    if (!res.ok) throw new Error(`set speed failed: ${res.status}`);
    const json = await res.json();
    return { speed: Number(json?.speed ?? speed) };
  }

  async setClipAudio(compositionId: string, layerId: string, clipId: string, audio: { volume?: number; muted?: boolean }): Promise<{ volume?: number; muted?: boolean }> {
    if (this.mode !== 'rest') {
      return audio;
    }
    const res = await fetch(
      `${this.baseUrl}/composition/set_clip_property/${encodeURIComponent(compositionId)}/${encodeURIComponent(layerId)}/${encodeURIComponent(clipId)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(audio),
      }
    );
    if (!res.ok) throw new Error(`set audio failed: ${res.status}`);
    return await res.json();
  }

  async setClipTransition(compositionId: string, layerId: string, clipId: string, transition: { type?: 'in' | 'out'; duration?: number; enabled?: boolean }): Promise<{ transition: typeof transition }> {
    if (this.mode !== 'rest') {
      return { transition };
    }
    const key = transition.type === 'in' ? 'transition_in' : 'transition_out';
    const body = {
      [key]: { duration: transition.duration, enabled: transition.enabled ?? true },
    };
    const res = await fetch(
      `${this.baseUrl}/composition/set_clip_property/${encodeURIComponent(compositionId)}/${encodeURIComponent(layerId)}/${encodeURIComponent(clipId)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );
    if (!res.ok) throw new Error(`set transition failed: ${res.status}`);
    const json = await res.json();
    return { transition: { ...transition, ...(json?.transition ?? {}) } };
  }

  async triggerClip(compositionId: string, clipId: string): Promise<{ triggered: boolean; compositionId: string; clipId: string }> {
    if (this.mode !== 'rest') {
      return { triggered: true, compositionId, clipId };
    }
    const res = await fetch(`${this.baseUrl}/clip/trigger/${encodeURIComponent(compositionId)}/${encodeURIComponent(clipId)}`, { method: 'POST' });
    if (!res.ok) throw new Error(`trigger clip failed: ${res.status}`);
    const json = await res.json();
    return { triggered: Boolean(json), compositionId, clipId };
  }

  async onCueTriggered({ compositionId, clipId }: { compositionId: string; clipId?: string }): Promise<any> {
    if (this.mode === 'websocket') {
      return {
        kind: 'websocket',
        action: 'select',
        address: `/composition/${compositionId}/select`
      };
    }
    if (this.mode === 'osc') {
      return {
        kind: 'osc',
        action: 'trigger',
        address: `/composition/${compositionId}/select`
      };
    }
    return this.triggerClip(compositionId, clipId ?? compositionId);
  }

  toDescriptor() {
    return {
      manifest: { name: this.name, version: '0.2.0', description: 'Resolume integration', category: 'integration' },
      create: async (config?: PluginConfig) => {
        const opts = (config as ResolumePluginOptions | undefined) ?? {};
        return new ResolumePlugin({
          mode: opts.mode,
          host: opts.host,
          port: opts.port,
          baseUrl: opts.baseUrl,
          name: opts.name,
        });
      }
    } satisfies PluginDescriptor as PluginDescriptor;
  }
}

export function toClip(input: any): Clip {
  const clip: Clip = {
    id: String(input?.id ?? input?.clipId ?? input?.name ?? 'clip'),
    name: input?.name,
    type: input?.type,
    video: Boolean(input?.video),
    audio: Boolean(input?.audio),
    path: input?.path ?? input?.source,
    src: input?.src ?? input?.source,
    visible: Boolean(input?.visible),
    playing: Boolean(input?.playing ?? input?.playmode === 'play'),
    currentTime: Number.isFinite(input?.currentTime) ? Number(input.currentTime) : 0,
    duration: Number.isFinite(input?.duration) ? Number(input.duration) : 0,
    loop: Boolean(input?.loop),
    speed: Number.isFinite(input?.speed) ? Number(input.speed) : 1,
    x: Number.isFinite(input?.x) ? Number(input.x) : 0,
    y: Number.isFinite(input?.y) ? Number(input.y) : 0,
    width: Number.isFinite(input?.width) ? Number(input.width) : 0,
    height: Number.isFinite(input?.height) ? Number(input.height) : 0,
    rotation: Number.isFinite(input?.rotation) ? Number(input.rotation) : 0,
    opacity: Number.isFinite(input?.opacity) ? Number(input.opacity) : 1,
    volume: Number.isFinite(input?.volume) ? Number(input.volume) : 1,
    muted: Boolean(input?.muted),
    transitionInEnabled: Boolean(input?.transitionIn?.enabled ?? input?.transitionInEnabled),
    transitionInDuration: Number.isFinite(input?.transitionIn?.duration ?? input?.transitionInDuration) ? Number(input.transitionInDuration ?? input.transitionIn.duration) : 0,
    transitionOutEnabled: Boolean(input?.transitionOut?.enabled ?? input?.transitionOutEnabled),
    transitionOutDuration: Number.isFinite(input?.transitionOut?.duration ?? input?.transitionOutDuration) ? Number(input.transitionOutDuration ?? input.transitionOut.duration) : 0,
  };
  return clip;
}

export const resolumePluginDescriptor: PluginDescriptor = new ResolumePlugin({ host: '127.0.0.1', port: 8080 }).toDescriptor();
