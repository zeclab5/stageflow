import { Plugin, PluginDescriptor } from 'stageflow-core';

export class TemplatePlugin implements Plugin {
  readonly name = 'template';

  async init(): Promise<void> {
    // TODO: initialize plugin
  }

  async shutdown(): Promise<void> {
    // TODO: cleanup plugin
  }

  connect() {
    return {
      name: this.name,
    };
  }
}

export const templateDescriptor: PluginDescriptor = {
  manifest: {
    name: 'template',
    version: '0.1.0',
    description: 'StageFlow template plugin',
    category: 'integration',
  },
  create: async () => new TemplatePlugin(),
};
