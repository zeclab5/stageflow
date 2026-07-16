import { Plugin, PluginConfig, PluginDescriptor } from 'stageflow-core';

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
      return `status=ok;mode=${transport};host=${this.baseUrl}`;
    }
    try {
      const res = await fetch(`${this.baseUrl}/composition/list_composition`, { signal: AbortSignal.timeout(2000) });
      return `status=ok;http=${res.status}`;
    } catch (err) {
      return `failed=${String(err).slice(0, 100)}`;
    }
  }

  async findCompositions() {
    if (this.mode !== 'rest') return [];
    const res = await fetch(`${this.baseUrl}/composition/list_composition`);
    if (!res.ok) throw new Error(`list compositions failed: ${res.status}`);
    return res.json() as Promise<unknown[]>;
  }

  async activateComposition(compositionId: string) {
    if (this.mode !== 'rest') return { mode: this.mode, compositionId };
    const res = await fetch(`${this.baseUrl}/composition/select/${encodeURIComponent(compositionId)}`, { method: 'POST' });
    if (!res.ok) throw new Error(`activate composition failed: ${res.status}`);
    return await res.json();
  }

  async triggerClip(compositionId: string, clipId: string) {
    if (this.mode !== 'rest') return { mode: this.mode, compositionId, clipId };
    const res = await fetch(`${this.baseUrl}/clip/trigger/${encodeURIComponent(compositionId)}/${encodeURIComponent(clipId)}`, { method: 'POST' });
    if (!res.ok) throw new Error(`trigger clip failed: ${res.status}`);
    return await res.json();
  }

  async getRenderTree(compositionId: string) {
    if (this.mode !== 'rest') return { mode: this.mode, compositionId };
    const res = await fetch(`${this.baseUrl}/composition/get/${encodeURIComponent(compositionId)}`);
    if (!res.ok) throw new Error(`get composition failed: ${res.status}`);
    return await res.json();
  }

  async onCueTriggered({ compositionId, clipId }: { compositionId: string; clipId?: string }) {
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
    return await this.triggerClip(compositionId, clipId ?? compositionId);
  }

  connect() {
    return this.baseUrl;
  }

  toDescriptor() {
    return {
      manifest: { name: this.name, version: '0.1.0', description: 'Resolume integration', category: 'integration' },
      create: async (config?: PluginConfig) => {
        const opts = (config as ResolumePluginOptions | undefined) ?? {};
        return new ResolumePlugin({
          mode: opts.mode as 'rest' | 'websocket' | 'osc' | undefined,
          host: opts.host as string | undefined,
          port: opts.port as number | undefined,
          baseUrl: opts.baseUrl as string | undefined,
          name: opts.name as string | undefined
        });
      }
    } satisfies PluginDescriptor as PluginDescriptor;
  }
}

export const resolumePluginDescriptor: PluginDescriptor = new ResolumePlugin({ host: '127.0.0.1', port: 8080 }).toDescriptor();
