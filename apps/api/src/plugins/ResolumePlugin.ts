import { Plugin, PluginConfig, PluginDescriptor } from 'stageflow-core';

type AnyDict = Record<string, unknown>;

interface RawCompositionResponse {
  layers?: AnyDict[];
  clips?: unknown[];
  data?: { layers?: AnyDict[]; clips?: unknown[] };
}

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

const first = <T>(...values: Array<T | undefined>) => values.find((value): value is T => value !== undefined);

const asString = (value: unknown): string | undefined => (typeof value === 'string' ? value : undefined);
const asBool = (value: unknown): boolean | undefined => (typeof value === 'boolean' ? value : undefined);
const asNumber = (value: unknown): number | undefined => (typeof value === 'number' ? value : undefined);

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
    const items = (await res.json()) as AnyDict[];
    return items.map((item) => ({
      id: String(first(item.id, item.compositionId, item.name, 'unknown')),
      name: first(item.name, item.fileName) as string | undefined,
    }));
  }

  async activateComposition(compositionId: string): Promise<{ compositionId: string; ok: boolean }> {
    if (this.mode !== 'rest') {
      return { compositionId, ok: true };
    }
    const res = await fetch(`${this.baseUrl}/composition/select/${encodeURIComponent(compositionId)}`, { method: 'POST' });
    if (!res.ok) throw new Error(`activate composition failed: ${res.status}`);
    return { compositionId, ok: Boolean((await res.json()) as boolean) };
  }

  async getRenderTree(compositionId: string): Promise<{ compositionId: string; layers: Layer[]; clips: Clip[][] }> {
    if (this.mode !== 'rest') {
      return { compositionId, layers: [], clips: [] };
    }
    const res = await fetch(`${this.baseUrl}/composition/get/${encodeURIComponent(compositionId)}`);
    if (!res.ok) throw new Error(`get composition failed: ${res.status}`);
    const payload = (await res.json()) as RawCompositionResponse;
    const nestedClips = payload.data?.clips ?? [];
    const rawLayers: AnyDict[] = payload.layers ?? [];
    const layers: Layer[] = rawLayers.map((layer, index) => ({
      id: String(first(asString(layer.id), asString(layer.name), `layer-${index}`)),
      index,
      name: asString(layer.name),
      video: asBool(layer.video),
      audio: asBool(layer.audio),
      width: asNumber(layer.width),
      height: asNumber(layer.height),
    }));
    const clipSources: unknown[] = Array.isArray(nestedClips) ? nestedClips : layers.map(() => []);
    const clips: Clip[][] = clipSources.map((layerClips) =>
      Array.isArray(layerClips)
        ? (layerClips as AnyDict[]).map((clip) => toClip(clip))
        : [toClip(layerClips as AnyDict)]
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
    const clipSource = ((await res.json()) as AnyDict)['clip'];
    return { currentVideoClip: toClip({ ...(clipSource ?? {}), path: videoPath, src: videoPath, type: 'video', video: true }) };
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
    const payload = (await res.json()) as AnyDict;
    return { playing: Boolean(payload['playing'] ?? true), playmode: String(payload['playmode'] ?? 'play') };
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
    const payload = (await res.json()) as AnyDict;
    return { playing: Boolean(payload['playing'] ?? false), playmode: String(payload['playmode'] ?? 'stop') };
  }

  async toggleClipPlayback(compositionId: string, layerId: string, clipId: string, play: boolean): Promise<{ playing: boolean; playmode: string }> {
    return play ? this.playClip(compositionId, layerId, clipId) : this.stopClip(compositionId, layerId, clipId);
  }

  async updateClipTransform(
    compositionId: string,
    layerId: string,
    clipId: string,
    transform: { x?: number; y?: number; width?: number; height?: number; rotation?: number; opacity?: number }
  ): Promise<{ transformed: boolean }> {
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

  async updateClipSpeed(compositionId: string, layerId: string, clipId: string, speed: number): Promise<{ speed: number }> {
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
    const payload = (await res.json()) as AnyDict;
    return { speed: Number(payload['speed'] ?? speed) };
  }

  async updateClipAudio(
    compositionId: string,
    layerId: string,
    clipId: string,
    audio: { volume?: number; muted?: boolean }
  ): Promise<{ volume?: number; muted?: boolean }> {
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
    return (await res.json()) as AnyDict;
  }

  async updateClipTransition(
    compositionId: string,
    layerId: string,
    clipId: string,
    transition: { type?: 'in' | 'out'; duration?: number; enabled?: boolean }
  ): Promise<{ transition: typeof transition }> {
    if (this.mode !== 'rest') {
      return { transition };
    }
    const key = transition.type === 'in' ? 'transition_in' : 'transition_out';
    const body: AnyDict = { [key]: { duration: transition.duration, enabled: transition.enabled ?? true } };
    const res = await fetch(
      `${this.baseUrl}/composition/set_clip_property/${encodeURIComponent(compositionId)}/${encodeURIComponent(layerId)}/${encodeURIComponent(clipId)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );
    if (!res.ok) throw new Error(`set transition failed: ${res.status}`);
    const payload = (await res.json()) as AnyDict;
    const incoming = payload['transition'];
    const merged = incoming != null && typeof incoming === 'object' ? { ...(incoming as AnyDict), ...transition } : transition;
    return { transition: merged as typeof transition };
  }

  async triggerClip(compositionId: string, clipId: string): Promise<{ triggered: boolean; compositionId: string; clipId: string }> {
    if (this.mode !== 'rest') {
      return { triggered: true, compositionId, clipId };
    }
    const res = await fetch(`${this.baseUrl}/clip/trigger/${encodeURIComponent(compositionId)}/${encodeURIComponent(clipId)}`, { method: 'POST' });
    if (!res.ok) throw new Error(`trigger clip failed: ${res.status}`);
    const payload = (await res.json()) as AnyDict;
    return { triggered: Boolean(payload), compositionId, clipId };
  }

  async onCueTriggered({ compositionId, clipId }: { compositionId: string; clipId?: string }): Promise<void> {
    if (this.mode === 'websocket' || this.mode === 'osc') {
      return;
    }
    await this.triggerClip(compositionId, clipId ?? compositionId);
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
      },
    } satisfies PluginDescriptor;
  }
}

export function toClip(input: unknown): Clip {
  const source = typeof input === 'object' && input !== null ? (input as AnyDict) : ({} as AnyDict);
  const transitionIn = (source.transitionIn as AnyDict | undefined) ?? (source.transitionInEnabled ? { enabled: true } : undefined);
  const transitionOut = (source.transitionOut as AnyDict | undefined) ?? (source.transitionOutEnabled ? { enabled: true } : undefined);
  const clip: Clip = {
    id: String(first(asString(source.id), asString(source.clipId), asString(source.name), 'clip')),
    name: asString(source.name),
    type: asString(source.type),
    video: asBool(source.video),
    audio: asBool(source.audio),
    path: first(asString(source.path), asString(source.source)),
    src: first(asString(source.src), asString(source.source)),
    visible: asBool(source.visible),
    playing: asBool(source.playing) ?? asString(source.playmode) === 'play',
    currentTime: asNumber(source.currentTime) ?? 0,
    duration: asNumber(source.duration) ?? 0,
    loop: asBool(source.loop),
    speed: asNumber(source.speed) ?? 1,
    x: asNumber(source.x) ?? 0,
    y: asNumber(source.y) ?? 0,
    width: asNumber(source.width) ?? 0,
    height: asNumber(source.height) ?? 0,
    rotation: asNumber(source.rotation) ?? 0,
    opacity: asNumber(source.opacity) ?? 1,
    volume: asNumber(source.volume) ?? 1,
    muted: asBool(source.muted),
    transitionInEnabled: asBool(source.transitionInEnabled) ?? asBool(transitionIn?.enabled),
    transitionInDuration: first(asNumber(source.transitionInDuration), asNumber(transitionIn?.duration)) ?? 0,
    transitionOutEnabled: asBool(source.transitionOutEnabled) ?? asBool(transitionOut?.enabled),
    transitionOutDuration: first(asNumber(source.transitionOutDuration), asNumber(transitionOut?.duration)) ?? 0,
  };
  return clip;
}

export const resolumePluginDescriptor: PluginDescriptor = {
  manifest: {
    name: 'resolume',
    version: '0.2.0',
    description: 'Resolume integration plugin',
    category: 'integration',
  },
  create: async (config?: PluginConfig) => {
    const opts = (config as ResolumePluginOptions | undefined) ?? {};
    return new ResolumePlugin({
      mode: opts.mode,
      host: opts.host,
      port: opts.port,
      baseUrl: opts.baseUrl,
      name: opts.name,
    });
  },
};
