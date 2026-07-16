import { Router } from 'express';
import { pluginRegistry } from '../container';
import { discoverPluginManifests } from 'stageflow-core';

const router = Router();

router.get('/', (_req, res) => {
  const loaded = pluginRegistry.all().map(plugin => ({ name: plugin.name }));
  const manifests = pluginRegistry.listManifests().map(manifest => ({ name: manifest.name, version: manifest.version, category: manifest.category }));
  const discovered = discoverPluginManifests().map(manifest => ({ name: manifest.name, version: manifest.version, description: manifest.description, category: manifest.category, entry: manifest.entry }));
  res.json({ loaded, manifests, discovered });
});

router.post('/:name/activate', async (req, res) => {
  try {
    const plugin = await pluginRegistry.load(req.params.name, req.body.config);
    res.status(201).json({ name: plugin.name });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown error';
    res.status(400).json({ error: message });
  }
});

export { router as PluginsRouter };
