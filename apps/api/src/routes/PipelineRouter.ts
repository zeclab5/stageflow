import { Router, Request, Response } from 'express';
import { SQLiteAssetPipelineRunRepository, initializeDatabase, AssetPipelineRunner } from 'stageflow-core';

const router = Router();

router.get('/runs', async (req: Request, res: Response) => {
  try {
    const db = await initializeDatabase('/tmp/stageflow-api.sqlite');
    const repository = new SQLiteAssetPipelineRunRepository(db);
    const runs = await repository.listByProject((req.query.projectId as string) || 'p1');
    return res.json(runs);
  } catch (error) {
    return res.status(500).json({ error: String(error) });
  }
});

router.post('/runs', async (req: Request, res: Response) => {
  try {
    const db = await initializeDatabase('/tmp/stageflow-api.sqlite');
    const repository = new SQLiteAssetPipelineRunRepository(db);
    const run = await repository.save(req.body);
    return res.status(201).json(run);
  } catch (error) {
    return res.status(500).json({ error: String(error) });
  }
});

router.post('/run', async (req: Request, res: Response) => {
  try {
    const db = await initializeDatabase('/tmp/stageflow-api.sqlite');
    const repository = new SQLiteAssetPipelineRunRepository(db);
    const runner = new AssetPipelineRunner();
    const root = String(req.body?.root || `${process.cwd()}/public/content`);
    const projectId = String(req.body?.projectId || 'p1');
    const runs = await runner.execute({ root, projectId, repository });
    return res.status(201).json(runs);
  } catch (error) {
    return res.status(500).json({ error: String(error) });
  }
});

export { router as PipelineRouter };
