import { Router } from 'express';
import { pluginRegistry } from '../container';

const router = Router();

router.get('/', (_req, res) => {
  const loaded = pluginRegistry.all().map(plugin => ({ name: plugin.name }));
  const manifests = pluginRegistry.listManifests().map(manifest => ({ name: manifest.name, version: manifest.version, category: manifest.category }));
  res.json({ loaded, manifests });
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
