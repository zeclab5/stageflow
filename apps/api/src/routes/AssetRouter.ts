import { Router } from 'express';
import type { RegisterAsset, RetireAsset } from 'stageflow-core';
import type { ListAssets } from 'stageflow-core';
import { container } from '../container';

const router = Router();

router.get('/', async (req, res) => {
  const list = container.resolve<ListAssets>('ListAssets');
  const assets = await list.execute(req.query.projectId as string);
  res.json(assets);
});

router.post('/', async (req, res) => {
  const create = container.resolve<RegisterAsset>('RegisterAsset');
  const asset = await create.execute(req.query.projectId as string, req.body.type, req.body.uri);
  res.status(201).json(asset);
});

router.get('/projects/:projectId', async (req, res) => {
  const list = container.resolve<ListAssets>('ListAssets');
  const assets = await list.execute(req.params.projectId);
  res.json(assets);
});

router.post('/projects/:projectId', async (req, res) => {
  const create = container.resolve<RegisterAsset>('RegisterAsset');
  const asset = await create.execute(req.params.projectId, req.body.type, req.body.uri);
  res.status(201).json(asset);
});

router.delete('/:id', async (req, res) => {
  const retire = container.resolve<RetireAsset>('RetireAsset');
  const asset = await retire.execute(req.params.id);
  res.json(asset);
});

export { router as AssetRouter };
