import { Router } from 'express';
import type { CueService } from 'stageflow-core';
import { container } from '../container';

const router = Router();

const service = (): CueService => container.resolve<CueService>('CueService');

router.get('/', async (req, res) => {
  const cues = await service().listByScene(req.query.sceneId as string);
  res.json(cues);
});

router.post('/', async (req, res) => {
  const cue = await service().create(req.body.sceneId, req.body.name, Number(req.body.timelinePosition));
  res.status(201).json(cue);
});

router.get('/:id', async (req, res) => {
  const cue = await service().get(req.params.id);
  res.json(cue);
});

router.patch('/:id', async (req, res) => {
  const cue = await service().rename(req.params.id, req.body.name);
  res.json(cue);
});

router.post('/:id/reorder', async (req, res) => {
  const cue = await service().reorder(req.params.id, Number(req.body.timelinePosition));
  res.json(cue);
});

router.delete('/:id', async (req, res) => {
  const cue = await service().remove(req.params.id);
  res.json(cue);
});

export { router as CueRouter };
