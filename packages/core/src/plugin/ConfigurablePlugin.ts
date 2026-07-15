export interface PluginConfig {
  [key: string]: unknown;
}

export interface ConfigurablePlugin {
  configure?(config: PluginConfig): Promise<void>;
}
