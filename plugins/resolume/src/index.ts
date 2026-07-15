import { Plugin, PluginConfig, PluginDescriptor } from 'stageflow-core';

export type { PluginConfig } from 'stageflow-core';

export interface ResolumePluginOptions {
  host?: string;
  port?: number;
}

export class ResolumePlugin implements Plugin {
  readonly name = 'resolume';

  constructor(private readonly options: ResolumePluginOptions) {}

  async init(): Promise<void> {
    console.log('resolume plugin init', this.options);
  }

  async shutdown(): Promise<void> {
    console.log('resolume plugin shutdown');
  }

  async connect() {
    return `connected:${this.options.host ?? '127.0.0.1'}:${this.options.port ?? 8080}`;
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
    const opts = (config as ResolumePluginOptions | undefined) ?? {};
    return new ResolumePlugin({ host: opts.host as string | undefined, port: (opts.port as number | undefined) });
  }
};
