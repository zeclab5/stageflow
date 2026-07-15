import { Router } from 'express';
import type { CreateProject } from 'stageflow-core';
import type { UpdateProject } from 'stageflow-core';
import type { CloseProject } from 'stageflow-core';
import type { GetProject } from 'stageflow-core';
import type { ListProjects, ProjectFilter } from 'stageflow-core';
import { container } from '../container';

const router = Router();

router.get('/', async (req, res) => {
  const list = container.resolve<ListProjects>('ListProjects');
  const filter: ProjectFilter = {};
  if (typeof req.query.status === 'string') {
    filter.status = req.query.status as ProjectFilter['status'];
  }
  if (typeof req.query.nameContains === 'string') {
    filter.nameContains = req.query.nameContains;
  }
  const projects = await list.execute(filter);
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
