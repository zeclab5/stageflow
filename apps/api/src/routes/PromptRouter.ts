import { Router } from 'express';
import type { PromptService } from 'stageflow-core';
import { container } from '../container';

const router = Router();

router.get('/', async (req, res) => {
  const service = container.resolve<PromptService>('PromptService');
  const prompts = await service.listByProject(req.query.projectId as string);
  res.json(prompts);
});

router.post('/', async (req, res) => {
  const service = container.resolve<PromptService>('PromptService');
  const prompt = await service.create(req.query.projectId as string, req.body.template, req.body.variables);
  res.status(201).json(prompt);
});

router.patch('/:id', async (req, res) => {
  const service = container.resolve<PromptService>('PromptService');
  const prompt = await service.updateTemplate(req.params.id, req.body.template);
  res.json(prompt);
});

export { router as PromptRouter };
