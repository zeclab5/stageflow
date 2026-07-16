import { Router, Request, Response } from 'express';
import { SQLiteCueRepository, SQLiteSceneRepository } from 'stageflow-core';
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
  res.status(204).send();
});

router.post('/stop', async (req: Request, res: Response) => {
  state.activeCueId = null;
  state.startedAt = null;
  res.status(204).send();
});

router.post('/cues/:id/trigger', async (req: Request, res: Response) => {
  const cue = await cueRepo().findById(req.params.id);
  if (!cue) return res.status(404).json({ error: 'not found' });
  const scene = await sceneRepo().findById(cue.sceneId);
  if (!scene) return res.status(404).json({ error: 'scene not found' });
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
