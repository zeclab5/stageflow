import { Router } from 'express';
import type { ScreenService } from 'stageflow-core';
import { container } from '../container';

const router = Router();

const service = (): ScreenService => container.resolve<ScreenService>('ScreenService');

router.get('/', async (req, res) => {
  const screens = await service().listByProject(req.query.projectId as string);
  res.json(screens);
});

router.post('/', async (req, res) => {
  const screen = await service().create(req.body.projectId, req.body.name, req.body.type, req.body.resolution ?? {}, req.body.description, req.body.enabled, req.body.order);
  res.status(201).json(screen);
});

router.get('/:id', async (req, res) => {
  const screen = await service().get(req.params.id);
  res.json(screen);
});

router.patch('/:id', async (req, res) => {
  const screen = await service().rename(req.params.id, req.body.name, req.body.description, req.body.type, req.body.resolution, req.body.enabled, req.body.order);
  res.json(screen);
});

router.delete('/:id', async (req, res) => {
  await service().remove(req.params.id);
  res.status(204).send();
});

export { router as ScreenRouter };
