import { Router } from 'express';
import type { SceneService } from 'stageflow-core';
import { container } from '../container';

const router = Router();

router.get('/', async (req, res) => {
  const service = container.resolve<SceneService>('SceneService');
  const scenes = await service.listByProject(req.query.projectId as string);
  res.json(scenes);
});

router.post('/', async (req, res) => {
  const service = container.resolve<SceneService>('SceneService');
  const scene = await service.create(req.query.projectId as string, req.body.name, req.body.order);
  res.status(201).json(scene);
});

router.patch('/:id', async (req, res) => {
  const service = container.resolve<SceneService>('SceneService');
  const scene = await service.rename(req.params.id, req.body.name);
  res.json(scene);
});

router.post('/:id/reorder', async (req, res) => {
  const service = container.resolve<SceneService>('SceneService');
  const scene = await service.reorder(req.params.id, req.body.order);
  res.json(scene);
});

router.delete('/:id', async (req, res) => {
  const service = container.resolve<SceneService>('SceneService');
  await service.remove(req.params.id);
  res.status(204).send();
});

export { router as SceneRouter };
