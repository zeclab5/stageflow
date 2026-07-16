import { Router, Request, Response } from 'express';

const router = Router();

const resolveBase = () => {
  return (
    process.env.RESOLUME_BASE_URL ||
    `http://${process.env.RESOLUME_HOST || '127.0.0.1'}:${Number(process.env.RESOLUME_PORT || 8080)}/api/v1`
  );
};

router.get('/status', async (_req: Request, res: Response) => {
  try {
    const base = resolveBase();
    const res1 = await fetch(`${base}/composition/list_composition`, { signal: AbortSignal.timeout(2000) });
    return res.json({ status: res1.ok ? 'ok' : `http_${res1.status}` });
  } catch (error) {
    return res.status(500).json({ error: String(error) });
  }
});

router.get('/compositions', async (_req: Request, res: Response) => {
  try {
    const base = resolveBase();
    const res1 = await fetch(`${base}/composition/list_composition`);
    if (!res1.ok) return res.status(500).json({ error: `list compositions failed: ${res1.status}` });
    const data = await res1.json();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: String(error) });
  }
});

export { router as ResolumeRouter };
