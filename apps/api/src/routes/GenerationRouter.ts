import { Router } from 'express';
import type { GenerationService } from 'stageflow-core';
import { container } from '../container';

const router = Router();

router.get('/', async (req, res) => {
  const service = container.resolve<GenerationService>('GenerationService');
  const generations = await service.listByProject(req.query.projectId as string);
  res.json(generations);
});

router.post('/', async (req, res) => {
  const service = container.resolve<GenerationService>('GenerationService');
  const generation = await service.create(
    req.query.projectId as string,
    req.body.provider,
    req.body.sceneId,
    req.body.promptId,
    req.body.params
  );
  res.status(201).json(generation);
});

router.post('/:id/status', async (req, res) => {
  const service = container.resolve<GenerationService>('GenerationService');
  const generation = await service.updateStatus(req.params.id, req.body.status);
  res.json(generation);
});

router.post('/:id/output', async (req, res) => {
  const service = container.resolve<GenerationService>('GenerationService');
  const generation = await service.attachOutput(req.params.id, req.body.outputUri);
  res.json(generation);
});

router.get('/:id', async (req, res) => {
  const service = container.resolve<GenerationService>('GenerationService');
  const generation = await service.get(req.params.id);
  res.json(generation);
});

export { router as GenerationRouter };
