import { Router } from 'express';
import type { CreateGenerationJob, UpdateGenerationStatus, AttachGenerationOutput } from 'stageflow-core';
import type { GetGeneration, ListGenerations } from 'stageflow-core';
import { container } from '../container';

const router = Router();

router.get('/', async (req, res) => {
  const list = container.resolve<ListGenerations>('ListGenerations');
  const jobs = await list.execute(req.query.projectId as string);
  res.json(jobs);
});

router.get('/projects/:projectId', async (req, res) => {
  const list = container.resolve<ListGenerations>('ListGenerations');
  const jobs = await list.execute(req.params.projectId);
  res.json(jobs);
});

router.post('/projects/:projectId', async (req, res) => {
  const create = container.resolve<CreateGenerationJob>('CreateGenerationJob');
  const job = await create.execute(req.params.projectId, req.body.provider, req.body.sceneId, req.body.promptId, req.body.params);
  res.status(201).json(job);
});

router.get('/:id', async (req, res) => {
  const get = container.resolve<GetGeneration>('GetGeneration');
  const job = await get.execute(req.params.id);
  res.json(job);
});

router.patch('/:id/status', async (req, res) => {
  const update = container.resolve<UpdateGenerationStatus>('UpdateGenerationStatus');
  const job = await update.execute(req.params.id, req.body.status);
  res.json(job);
});

router.post('/:id/output', async (req, res) => {
  const attach = container.resolve<AttachGenerationOutput>('AttachGenerationOutput');
  const job = await attach.execute(req.params.id, req.body.outputUri);
  res.json(job);
});

export { router as GenerationRouter };
