import { Router, Request, Response } from 'express';
import { MultiScreenRenderer, SQLiteCueRepository, SQLiteSceneRepository, SQLiteSceneObjectRepository, SQLiteScreenRepository, eventBus, initializeDatabase } from 'stageflow-core';
import { container } from '../container';

const router = Router();
const renderer = new MultiScreenRenderer();
const cueRepo = (): SQLiteCueRepository => container.resolve<SQLiteCueRepository>('SQLiteCueRepository');
const sceneRepo = (): SQLiteSceneRepository => container.resolve<SQLiteSceneRepository>('SQLiteSceneRepository');
const objectRepo = (): SQLiteSceneObjectRepository => container.resolve<SQLiteSceneObjectRepository>('SQLiteSceneObjectRepository');
const screenRepo = (): SQLiteScreenRepository => container.resolve<SQLiteScreenRepository>('SQLiteScreenRepository');

const playbackState = { projectId: 'p1', activeCueId: null as string | null, startedAt: null as Date | null };

router.get('/status', async (_req: Request, res: Response) => {
  res.json({ playing: Boolean(playbackState.activeCueId), projectId: playbackState.projectId });
});

router.post('/start', async (req: Request, res: Response) => {
  playbackState.projectId = (req.body.projectId as string) || 'p1';
  playbackState.activeCueId = null;
  playbackState.startedAt = new Date();
  await eventBus.publish({ occurredAt: new Date(), eventType: 'PlaybackStarted' });
  res.status(204).send();
});

router.post('/stop', async (_req: Request, res: Response) => {
  playbackState.activeCueId = null;
  playbackState.startedAt = null;
  await eventBus.publish({ occurredAt: new Date(), eventType: 'PlaybackStopped' });
  res.status(204).send();
});

router.post('/advance', async (req: Request, res: Response) => {
  const projectId = playbackState.projectId;
  const current = playbackState.activeCueId ? await cueRepo().findById(playbackState.activeCueId) : null;
  const sceneId = (req.body.sceneId as string) || current?.sceneId;
  const candidates = sceneId ? await cueRepo().listByScene(sceneId) : [];
  const activeIndex = current ? candidates.findIndex((c) => c.id === current.id) : -1;
  const next = candidates[(activeIndex + 1) % candidates.length] || current || candidates[0];
  if (!next) return res.status(404).json({ error: 'no cues' });
  const scene = await sceneRepo().findById(next.sceneId);
  if (!scene) return res.status(404).json({ error: 'scene not found' });
  playbackState.activeCueId = next.id;
  playbackState.projectId = scene.projectId;
  const objects = await objectRepo().listByScene(scene.id);
  const screens = await screenRepo().listByProject(projectId);
  const renderTree = renderer.buildTrees(objects, screens, scene.id);
  await eventBus.publish({ occurredAt: new Date(), eventType: 'CueTriggered' });
  res.json({ cue: next, scene, renderTree });
});

router.post('/cues/:id/trigger', async (req: Request, res: Response) => {
  const cue = await cueRepo().findById(req.params.id);
  if (!cue) return res.status(404).json({ error: 'not found' });
  const scene = await sceneRepo().findById(cue.sceneId);
  if (!scene) return res.status(404).json({ error: 'scene not found' });
  playbackState.projectId = scene.projectId;
  playbackState.activeCueId = cue.id;
  const objects = await objectRepo().listByScene(scene.id);
  const screens = await screenRepo().listByProject(scene.projectId);
  const renderTree = renderer.buildTrees(objects, screens, scene.id);
  await eventBus.publish({ occurredAt: new Date(), eventType: 'CueTriggered' });
  res.json({ cue, targetScene: scene, renderTree });
});

export { router as PlaybackRouter };
