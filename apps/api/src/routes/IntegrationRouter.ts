import { Router } from 'express';
import type { IntegrationService } from 'stageflow-core';
import { container } from '../container';

const router = Router();

router.get('/', async (_req, res) => {
  const service = container.resolve<IntegrationService>('IntegrationService');
  const integrations = await service.list();
  res.json(integrations);
});

router.post('/', async (req, res) => {
  const service = container.resolve<IntegrationService>('IntegrationService');
  const integration = await service.create(req.body.name, req.body.type, req.body.config);
  res.status(201).json(integration);
});

router.post('/:id/activate', async (req, res) => {
  const service = container.resolve<IntegrationService>('IntegrationService');
  const integration = await service.activate(req.params.id);
  res.json(integration);
});

router.post('/:id/suspend', async (req, res) => {
  const service = container.resolve<IntegrationService>('IntegrationService');
  const integration = await service.suspend(req.params.id);
  res.json(integration);
});

router.get('/:id', async (req, res) => {
  const service = container.resolve<IntegrationService>('IntegrationService');
  const integration = await service.get(req.params.id);
  res.json(integration);
});

export { router as IntegrationRouter };
