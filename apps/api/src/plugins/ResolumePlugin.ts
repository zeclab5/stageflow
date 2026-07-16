import { Plugin, PluginConfig, PluginDescriptor } from 'stageflow-core';

export interface ResolumeApiOptions {
  host?: string;
  port?: number;
  name?: string;
}

export class ResolumePlugin implements Plugin {
  readonly name: string;
  private readonly baseUrl: string;

  constructor(options: ResolumeApiOptions = {}) {
    const host = options.host ?? '127.0.0.1';
    const port = options.port ?? 8080;
    this.baseUrl = `http://${host}:${port}/api/v1`;
    this.name = options.name ?? 'resolume';
  }

  async init(): Promise<void> {
    const result = await this.status();
    if (!result.startsWith('status=')) {
      throw new Error(`resolume not ready: ${result}`);
    }
  }

  async shutdown(): Promise<void> {
    console.log('resolume plugin shutdown');
  }

  async status(): Promise<string> {
    try {
      const res = await fetch(`${this.baseUrl}/composition/list_composition`, { signal: AbortSignal.timeout(2000) });
      return `status=${res.status}`;
    } catch (err) {
      return `failed=${String(err).slice(0, 100)}`;
    }
  }

  connect() {
    return this.baseUrl;
  }
}

export const resolumePluginDescriptor: PluginDescriptor = {
  manifest: {
    name: 'resolume',
    version: '0.1.0',
    description: 'Resolume integration plugin stub',
    category: 'integration'
  },
  create: async (config?: PluginConfig) => {
    const opts = (config as ResolumeApiOptions | undefined) ?? {};
    return new ResolumePlugin({
      host: opts.host as string | undefined,
      port: opts.port as number | undefined,
      name: opts.name as string | undefined,
    });
  }
};
