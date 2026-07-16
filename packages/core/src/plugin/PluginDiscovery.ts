import { readdirSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { PluginPackageJson, PluginManifestSchema } from './PluginManifest';

export interface ResolvedPluginManifest extends PluginManifestSchema {
  name: string;
  version?: string;
  description?: string;
  category?: 'integration' | 'generation' | 'storage' | 'ui';
}

const PLUGIN_ROOT = join(process.cwd(), 'plugins');

export function discoverPluginManifests(): ResolvedPluginManifest[] {
  if (!existsSync(PLUGIN_ROOT)) return [];
  const entries = readdirSync(PLUGIN_ROOT, { withFileTypes: true });
  const results: ResolvedPluginManifest[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const packageJsonPath = join(PLUGIN_ROOT, entry.name, 'package.json');
    if (!existsSync(packageJsonPath)) continue;
    let payload: PluginPackageJson;
    try {
      payload = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as PluginPackageJson;
    } catch {
      continue;
    }
    const stageflowPlugin = payload.stageflowPlugin;
    if (!stageflowPlugin?.entry) continue;
    results.push({
      name: payload.name,
      version: payload.version,
      description: payload.description,
      category: stageflowPlugin.category ?? 'integration',
      entry: stageflowPlugin.entry,
      module: stageflowPlugin.module,
      types: stageflowPlugin.types,
    });
  }
  return results;
}

export function resolvePluginEntryPath(manifest: ResolvedPluginManifest): string {
  const directory = join(PLUGIN_ROOT, manifest.name);
  if (manifest.entry.startsWith('.') || manifest.entry.startsWith('/')) {
    return join(directory, manifest.entry);
  }
  return join(directory, manifest.entry);
}
