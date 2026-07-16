import { Router, Request, Response } from 'express';
import { SQLiteCueRepository, SQLiteSceneRepository, eventBus, initializeDatabase } from 'stageflow-core';
import { container } from '../container';

const router = Router();
const cueRepo = (): SQLiteCueRepository => container.resolve<SQLiteCueRepository>('SQLiteCueRepository');
const sceneRepo = (): SQLiteSceneRepository => container.resolve<SQLiteSceneRepository>('SQLiteSceneRepository');

const state = { projectId: 'p1', activeCueId: null as string | null, startedAt: null as Date | null };
const playback = () => state;

router.post('/start', async (req: Request, res: Response) => {
  state.projectId = (req.body.projectId as string) || 'p1';
  state.activeCueId = null;
  state.startedAt = new Date();
  await eventBus.publish({ occurredAt: state.startedAt, eventType: 'PlaybackStarted' });
  res.status(204).send();
});

router.post('/stop', async (req: Request, res: Response) => {
  state.activeCueId = null;
  state.startedAt = null;
  await eventBus.publish({ occurredAt: new Date(), eventType: 'PlaybackStopped' });
  res.status(204).send();
});

router.post('/cues/:id/trigger', async (req: Request, res: Response) => {
  const cue = await cueRepo().findById(req.params.id);
  if (!cue) return res.status(404).json({ error: 'not found' });
  const scene = await sceneRepo().findById(cue.sceneId);
  if (!scene) return res.status(404).json({ error: 'scene not found' });
  state.projectId = scene.projectId;
  state.activeCueId = cue.id;
  await eventBus.publish({ occurredAt: new Date(), eventType: 'CueTriggered' });
  res.json({ cue, targetScene: scene });
});

router.post('/advance', async (req: Request, res: Response) => {
  const projectId = state.projectId;
  const current = state.activeCueId ? await cueRepo().findById(state.activeCueId) : null;
  const cursor = current ? current.timelinePosition : -Infinity;
  const db = await initializeDatabase('/tmp/stageflow-api.sqlite');
  const next = await db.get<Record<string, unknown>>(`SELECT * FROM cues WHERE scene_id IN (SELECT id FROM scenes WHERE project_id = ?) AND timeline_position > ? ORDER BY timeline_position ASC LIMIT 1`, [projectId, cursor]);
  if (!next) return res.status(204).send();
  const cue = await cueRepo().findById(String(next.id));
  if (!cue) return res.status(204).send();
  const scene = await sceneRepo().findById(cue.sceneId);
  if (!scene) return res.status(204).send();
  state.activeCueId = cue.id;
  res.json({ cue, targetScene: scene });
});

router.get('/status', async (_req: Request, res: Response) => {
  res.json({
    projectId: playback().projectId,
    activeCueId: playback().activeCueId,
    startedAt: playback().startedAt,
    playing: Boolean(playback().startedAt),
  });
});

export { router as PlaybackRouter };
