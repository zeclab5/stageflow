import { Router } from 'express';
import type { CreateProject } from '@core/application/command/CreateProject';
import type { UpdateProject } from '@core/application/command/UpdateProject';
import type { CloseProject } from '@core/application/command/CloseProject';
import type { GetProject } from '@core/application/query/GetProject';
import type { ListProjects } from '@core/application/query/ListProjects';
import { container } from '../container';

const router = Router();

router.get('/', async (_req, res) => {
  const list = container.resolve<ListProjects>('ListProjects');
  const projects = await list.execute();
  res.json(projects);
});

router.post('/', async (req, res) => {
  const create = container.resolve<CreateProject>('CreateProject');
  const project = await create.execute(req.body.name);
  res.status(201).json(project);
});

router.get('/:id', async (req, res) => {
  const get = container.resolve<GetProject>('GetProject');
  try {
    const project = await get.execute(req.params.id);
    res.json(project);
  } catch {
    res.status(404).json({ error: 'project not found' });
  }
});

router.patch('/:id', async (req, res) => {
  const update = container.resolve<UpdateProject>('UpdateProject');
  const project = await update.execute(req.params.id, { name: req.body.name });
  res.json(project);
});

router.post('/:id/close', async (req, res) => {
  const close = container.resolve<CloseProject>('CloseProject');
  const project = await close.execute(req.params.id);
  res.json(project);
});

export { router as ProjectRouter };
