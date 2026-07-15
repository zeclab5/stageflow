export interface PluginLoader { load(plugin: Plugin): Promise<void>; }
