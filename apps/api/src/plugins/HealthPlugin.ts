import { Plugin, PluginDescriptor } from 'stageflow-core';

export class HealthPlugin implements Plugin {
  readonly name = 'health';
  async init(): Promise<void> {
    console.log('health plugin init');
  }
  async shutdown(): Promise<void> {
    console.log('health plugin shutdown');
  }
}

export const healthPluginDescriptor: PluginDescriptor = {
  manifest: {
    name: 'health',
    version: '0.1.0',
    description: 'Simple health plugin for plugin registry verification',
    category: 'ui'
  },
  create: async () => Promise.resolve(new HealthPlugin())
};
