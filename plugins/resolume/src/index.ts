import { Plugin, PluginDescriptor } from 'stageflow-core';

export interface ResolumePluginOptions {
  host?: string;
  port?: number;
}
import { Plugin, PluginDescriptor } from 'stageflow-core';

export interface ResolumePluginOptions {
  host?: string;
  port?: number;
}

export class ResolumePlugin implements Plugin {
  readonly name = 'resolume';

  private host: string;
  private port: number;

  constructor(options: ResolumePluginOptions = {}) {
    this.host = options.host ?? '127.0.0.1';
    this.port = options.port ?? 8080;
  }

  async init(): Promise<void> {
    const res = await fetch(`http://${this.host}:${this.port}/`, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) {
      throw new Error(`resolume not ready: ${res.status}`);
    }
  }

  async shutdown(): Promise<void> {
    console.log('resolume plugin shutdown');
  }

  connect(): string {
    return `connected:${this.host}:${this.port}`;
  }

  async go(address: string, value: unknown) {
    await fetch(`http://${this.host}:${this.port}/api/v1/osc`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ address, value })
    });
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
