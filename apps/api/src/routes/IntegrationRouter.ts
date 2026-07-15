import { Router } from 'express';
import type { CreateIntegrationProfile, ActivateIntegration, SuspendIntegration } from '@core/application/command/IntegrationCommand';
import type { GetIntegration, ListIntegrations } from '@core/application/query/IntegrationQuery';
import { container } from '../container';

const router = Router();

router.get('/', async (_req, res) => {
  const list = container.resolve<ListIntegrations>('ListIntegrations');
  const integrations = await list.execute();
  res.json(integrations);
});

router.post('/', async (req, res) => {
  const create = container.resolve<CreateIntegrationProfile>('CreateIntegrationProfile');
  const integration = await create.execute(req.body.name, req.body.type, req.body.config);
  res.status(201).json(integration);
});

router.post('/:id/activate', async (req, res) => {
  const activate = container.resolve<ActivateIntegration>('ActivateIntegration');
  const integration = await activate.execute(req.params.id);
  res.json(integration);
});

router.post('/:id/suspend', async (req, res) => {
  const suspend = container.resolve<SuspendIntegration>('SuspendIntegration');
  const integration = await suspend.execute(req.params.id);
  res.json(integration);
});

router.get('/:id', async (req, res) => {
  const get = container.resolve<GetIntegration>('GetIntegration');
  const integration = await get.execute(req.params.id);
  res.json(integration);
});

export { router as IntegrationRouter };
