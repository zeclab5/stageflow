import { Router } from 'express';
import type { AssetService } from 'stageflow-core';
import { container } from '../container';

const router = Router();

const service = (): AssetService => container.resolve<AssetService>('AssetService');

router.get('/', async (req, res) => {
  const assets = await service().listByProject(req.query.projectId as string);
  res.json(assets);
});

router.post('/', async (req, res) => {
  const asset = await service().register(req.body.projectId, req.body.type, req.body.name, req.body.uri, req.body.description, req.body.tags, req.body.size);
  res.status(201).json(asset);
});

router.delete('/:id', async (req, res) => {
  await service().retire(req.params.id);
  res.status(204).send();
});

export { router as AssetRouter };
