import { Plugin, PluginDescriptor } from 'stageflow-core';

export interface ResolumePluginOptions {
  host?: string;
  port?: number;
  baseUrl?: string;
}

export class ResolumePlugin implements Plugin {
  readonly name = 'resolume';

  private readonly baseUrl: string;

  constructor(options: ResolumePluginOptions = {}) {
    const host = options.host ?? '127.0.0.1';
    const port = options.port ?? 8080;
    this.baseUrl = options.baseUrl ?? `http://${host}:${port}/api/v1`;
  }

  async init(): Promise<void> {
    const res = await fetch(`${this.baseUrl}/composition/list_composition`, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) {
      throw new Error(`resolume not ready: ${res.status}`);
    }
  }

  async shutdown(): Promise<void> {
    console.log('resolume plugin shutdown');
  }

  connect(): string {
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
  create: async (config?: Record<string, unknown>) => {
    const opts = (config as ResolumePluginOptions | undefined) ?? {};
    const plugin = new ResolumePlugin(opts);
    await plugin.init();
    return plugin;
  }
};
