import { Plugin } from './Plugin';
import { InMemoryPluginLoader, PluginLoadError } from './InMemoryPluginLoader';

export interface PluginConfig {
  [key: string]: unknown;
}

export interface ConfigurablePlugin extends Plugin {
  configure?(config: PluginConfig): Promise<void>;
}

export interface PluginManifest {
  name: string;
  version: string;
  description?: string;
  category: 'integration' | 'generation' | 'storage' | 'ui';
}

export interface PluginDescriptor {
  manifest: PluginManifest;
  create(config?: PluginConfig): Promise<Plugin>;
}

export interface PluginRegistryHooks {
  onBeforeLoad?(descriptor: PluginDescriptor): Promise<void>;
  onLoaded?(plugin: Plugin): Promise<void>;
  onLoadFailed?(descriptor: PluginDescriptor, error: Error): Promise<void>;
}

export class PluginRegistry {
  private readonly loader = new InMemoryPluginLoader();
  private readonly descriptors = new Map<string, PluginDescriptor>();
  private readonly manifests = new Map<string, PluginManifest>();
  private hooks?: PluginRegistryHooks;

  constructor(hooks?: PluginRegistryHooks) {
    this.hooks = hooks;
  }

  registerDescriptor(descriptor: PluginDescriptor): void {
    this.descriptors.set(descriptor.manifest.name, descriptor);
    this.manifests.set(descriptor.manifest.name, descriptor.manifest);
  }

  getManifest(name: string): PluginManifest | undefined {
    return this.manifests.get(name);
  }

  listManifests(): PluginManifest[] {
    return Array.from(this.manifests.values());
  }

  async load(name: string, config?: PluginConfig): Promise<Plugin> {
    const descriptor = this.descriptors.get(name);
    if (!descriptor) {
      throw new PluginLoadError(name, 'descriptor not registered');
    }

    const plugin = await descriptor.create(config);

    if (this.hooks?.onBeforeLoad) {
      await this.hooks.onBeforeLoad(descriptor);
    }

    try {
      const configured = plugin as Plugin & ConfigurablePlugin;
      if (configured.configure && config) {
        await configured.configure(config);
      }
      await this.loader.load(plugin);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      if (this.hooks?.onLoadFailed) {
        await this.hooks.onLoadFailed(descriptor, err);
      }
      throw new PluginLoadError(name, err.message);
    }

    if (this.hooks?.onLoaded) {
      await this.hooks.onLoaded(plugin);
    }

    return plugin;
  }

  get(name: string) {
    return this.loader.get(name);
  }

  all() {
    return Array.from(this.loader.all());
  }

  async shutdown(name: string): Promise<void> {
    await this.loader.shutdown(name);
  }
}
