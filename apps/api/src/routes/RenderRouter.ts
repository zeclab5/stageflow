import { Router, Request, Response } from 'express';
import { MultiScreenRenderer, SQLiteSceneObjectRepository, SQLiteScreenRepository, SQLiteSceneRepository } from 'stageflow-core';
import { container } from '../container';

const router = Router();
const renderer = new MultiScreenRenderer();
const objectRepo = (): SQLiteSceneObjectRepository => container.resolve<SQLiteSceneObjectRepository>('SQLiteSceneObjectRepository');
const screenRepo = (): SQLiteScreenRepository => container.resolve<SQLiteScreenRepository>('SQLiteScreenRepository');
const sceneRepo = (): SQLiteSceneRepository => container.resolve<SQLiteSceneRepository>('SQLiteSceneRepository');

router.get('/scene/:sceneId', async (req: Request, res: Response) => {
  const projectId = (req.query.projectId as string) || 'p1';
  const objects = await objectRepo().listByScene(req.params.sceneId);
  const screens = await screenRepo().listByProject(projectId);
  const scene = await sceneRepo().findById(req.params.sceneId);
  if (!scene) return res.status(404).json({ error: 'scene not found' });
  const result = renderer.buildTrees(objects, screens, scene.id);
  res.json(result);
});

export { router as RenderRouter };
