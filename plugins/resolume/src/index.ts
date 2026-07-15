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
    console.log('resolume plugin init');
  }

  async shutdown(): Promise<void> {
    console.log('resolume plugin shutdown');
  }

  connect(): string {
    return `connected:${this.host}:${this.port}`;
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
    return new ResolumePlugin(opts);
  }
};
