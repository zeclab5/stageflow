import { Plugin } from '../plugin/Plugin';

export class PluginLoadError extends Error {
  constructor(pluginName: string, message?: string) {
    super(`failed to load plugin: ${pluginName}${message ? `: ${message}` : ''}`);
    this.name = 'PluginLoadError';
  }
}

export class InMemoryPluginLoader {
  private readonly plugins = new Map<string, Plugin>();

  async load(plugin: Plugin): Promise<void> {
    if (this.plugins.has(plugin.name)) {
      throw new PluginLoadError(plugin.name, 'already loaded');
    }
    try {
      await plugin.init();
      this.plugins.set(plugin.name, plugin);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new PluginLoadError(plugin.name, message);
    }
  }

  get(name: string) {
    return this.plugins.get(name);
  }

  all() {
    return Array.from(this.plugins.values());
  }

  async shutdown(name: string): Promise<void> {
    const plugin = this.plugins.get(name);
    if (!plugin) return;
    await plugin.shutdown();
    this.plugins.delete(name);
  }
}
