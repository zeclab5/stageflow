import { Plugin, PluginConfig, PluginDescriptor } from 'stageflow-core';

export interface ResolumePluginOptions {
  readonly host?: string;
  readonly port?: number;
  readonly baseUrl?: string;
  readonly name?: string;
}

export class ResolumePlugin implements Plugin {
  readonly name: string;
  private readonly baseUrl: string;

  constructor(options: ResolumePluginOptions = {}) {
    const host = options.host ?? '127.0.0.1';
    const port = options.port ?? 8080;
    this.baseUrl = options.baseUrl ?? `http://${host}:${port}/api/v1`;
    this.name = options.name ?? 'resolume';
  }

  async init(): Promise<void> {
    const status = await this.status();
    if (status !== 'ok') {
      throw new Error(`resolume not ready: ${status}`);
    }
  }

  async shutdown(): Promise<void> {
    console.log('resolume plugin shutdown');
  }

  async status() {
    try {
      const res = await fetch(`${this.baseUrl}/composition/list_composition`, { signal: AbortSignal.timeout(2000) });
      if (!res.ok) {
        return `http_${res.status}`;
      }
      return 'ok';
    } catch (err) {
      return String(err).slice(0, 120);
    }
  }

  async findCompositions() {
    const res = await fetch(`${this.baseUrl}/composition/list_composition`);
    if (!res.ok) {
      throw new Error(`list compositions failed: ${res.status}`);
    }
    return res.json() as Promise<unknown[]>;
  }

  toDescriptor() {
    return {
      manifest: {
        name: this.name,
        version: '0.1.0',
        description: 'Resolume integration',
        category: 'integration'
      },
      create: async (config?: PluginConfig) => {
        const opts = (config as ResolumePluginOptions | undefined) ?? {};
        return new ResolumePlugin({
          host: opts.host as string | undefined,
          port: opts.port as number | undefined,
          baseUrl: opts.baseUrl as string | undefined,
          name: opts.name as string | undefined,
        });
      }
    } satisfies PluginDescriptor as PluginDescriptor;
  }
}

export const resolumePluginDescriptor: PluginDescriptor = new ResolumePlugin({ host: '127.0.0.1', port: 8080 }).toDescriptor();
