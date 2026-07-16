import { Router, Request, Response } from 'express';
import { MultiScreenRenderer, SQLiteSceneObjectRepository, SQLiteScreenRepository, SQLiteSceneRepository, SQLiteCueRepository } from 'stageflow-core';
import { container } from '../container';

const router = Router();
const renderer = new MultiScreenRenderer();
const objectRepo = (): SQLiteSceneObjectRepository => container.resolve<SQLiteSceneObjectRepository>('SQLiteSceneObjectRepository');
const screenRepo = (): SQLiteScreenRepository => container.resolve<SQLiteScreenRepository>('SQLiteScreenRepository');
const sceneRepo = (): SQLiteSceneRepository => container.resolve<SQLiteSceneRepository>('SQLiteSceneRepository');
const cueRepo = (): SQLiteCueRepository => container.resolve<SQLiteCueRepository>('SQLiteCueRepository');

router.get('/compositions', async (_req: Request, res: Response) => {
  const scenes = await sceneRepo().listByProject('p1');
  res.json({ compositions: scenes.map((s) => ({ id: s.id, name: s.name })) });
});

router.get('/compositions/:sceneId/render', async (req: Request, res: Response) => {
  const scene = await sceneRepo().findById(req.params.sceneId);
  if (!scene) return res.status(404).json({ error: 'scene not found' });
  const objects = await objectRepo().listByScene(scene.id);
  const screens = await screenRepo().listByProject(scene.projectId);
  const result = renderer.buildTrees(objects, screens, scene.id);
  res.json(result);
});

router.post('/compositions/:sceneId/cues/:cueId/trigger', async (req: Request, res: Response) => {
  const cue = await cueRepo().findById(req.params.cueId);
  if (!cue || cue.sceneId !== req.params.sceneId) {
    return res.status(404).json({ error: 'cue not found' });
  }
  const scene = await sceneRepo().findById(cue.sceneId);
  if (!scene) return res.status(404).json({ error: 'scene not found' });
  const objects = await objectRepo().listByScene(scene.id);
  const screens = await screenRepo().listByProject(scene.projectId);
  const renderTree = renderer.buildTrees(objects, screens, scene.id);
  res.json({ cue, targetScene: scene, renderTree });
});

export { router as ResolumeAPIRouter };
