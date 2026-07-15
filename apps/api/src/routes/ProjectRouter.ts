import { Router } from 'express';
import { container } from '../container';

const router = Router();

router.get('/', async (_req, res) => {
  const list = container.resolve('ListProjects') as any;
  const projects = await list.list();
  res.json(projects);
});

router.post('/', async (req, res) => {
  const service = container.resolve('ProjectService') as any;
  const project = await service.create(req.body.name);
  res.status(201).json(project);
});

router.get('/:id', async (req, res) => {
  const service = container.resolve('ProjectService') as any;
  try {
    const project = await service.get(req.params.id);
    res.json(project);
  } catch {
    res.status(404).json({ error: 'project not found' });
  }
});

router.patch('/:id', async (req, res) => {
  const service = container.resolve('ProjectService') as any;
  const project = await service.update(req.params.id, req.body.name);
  res.json(project);
});

router.post('/:id/close', async (req, res) => {
  const service = container.resolve('ProjectService') as any;
  const project = await service.close(req.params.id);
  res.json(project);
});

export { router as ProjectRouter };
