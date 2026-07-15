import { Router } from 'express';
import type { CreatePrompt, UpdatePromptTemplate } from 'stageflow-core';
import type { ListPrompts } from 'stageflow-core';
import { container } from '../container';

const router = Router();

router.get('/', async (req, res) => {
  const list = container.resolve<ListPrompts>('ListPrompts');
  const prompts = await list.execute(req.query.projectId as string);
  res.json(prompts);
});
router.get('/projects/:projectId', async (req, res) => {
  const list = container.resolve<ListPrompts>('ListPrompts');
  const prompts = await list.execute(req.params.projectId);
  res.json(prompts);
});

router.post('/projects/:projectId', async (req, res) => {
  const create = container.resolve<CreatePrompt>('CreatePrompt');
  const prompt = await create.execute(req.params.projectId, req.body.template, req.body.variables);
  res.status(201).json(prompt);
});

router.patch('/:id/template', async (req, res) => {
  const update = container.resolve<UpdatePromptTemplate>('UpdatePromptTemplate');
  const prompt = await update.execute(req.params.id, req.body.template);
  res.json(prompt);
});

export { router as PromptRouter };
