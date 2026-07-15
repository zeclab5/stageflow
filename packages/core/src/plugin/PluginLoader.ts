import { Plugin } from '../plugin/Plugin';
export interface PluginLoader { load(plugin: Plugin): Promise<void>; }
