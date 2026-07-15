import { Router } from 'express';
import type { CreateScene, RenameScene, ReorderScene } from 'stageflow-core';
import type { ListScenes } from 'stageflow-core';
import { container } from '../container';

const router = Router();

router.get('/projects/:projectId', async (req, res) => {
  const list = container.resolve<ListScenes>('ListScenes');
  const scenes = await list.execute(req.params.projectId);
  res.json(scenes);
});

router.post('/projects/:projectId', async (req, res) => {
  const create = container.resolve<CreateScene>('CreateScene');
  const scene = await create.execute(req.params.projectId, req.body.name, Number(req.body.order));
  res.status(201).json(scene);
});

router.patch('/:id', async (req, res) => {
  const rename = container.resolve<RenameScene>('RenameScene');
  const scene = await rename.execute(req.params.id, req.body.name);
  res.json(scene);
});

router.post('/:id/reorder', async (req, res) => {
  const reorder = container.resolve<ReorderScene>('ReorderScene');
  const scene = await reorder.execute(req.params.id, Number(req.body.order));
  res.json(scene);
});

export { router as SceneRouter };
