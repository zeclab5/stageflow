import { Router } from 'express';
import type { AssetService } from 'stageflow-core';
import { container } from '../container';

const router = Router();

router.get('/', async (req, res) => {
  const service = container.resolve<AssetService>('AssetService');
  const assets = await service.listByProject(req.query.projectId as string);
  res.json(assets);
});

router.post('/', async (req, res) => {
  const service = container.resolve<AssetService>('AssetService');
  const asset = await service.register(req.query.projectId as string, req.body.type, req.body.uri);
  res.status(201).json(asset);
});

router.get('/projects/:projectId', async (req, res) => {
  const service = container.resolve<AssetService>('AssetService');
  const assets = await service.listByProject(req.params.projectId);
  res.json(assets);
});

router.post('/projects/:projectId', async (req, res) => {
  const service = container.resolve<AssetService>('AssetService');
  const asset = await service.register(req.params.projectId, req.body.type, req.body.uri);
  res.status(201).json(asset);
});

router.delete('/:id', async (req, res) => {
  const service = container.resolve<AssetService>('AssetService');
  try {
    const asset = await service.retire(req.params.id);
    res.json(asset);
  } catch {
    res.status(404).json({ error: 'asset not found' });
  }
});

export { router as AssetRouter };
