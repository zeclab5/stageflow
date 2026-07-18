import { Router, Request, Response } from 'express';
import { container } from '../container';

interface CompositionItem {
  id: string;
  name?: string;
}

interface LayerItem {
  id: string;
  index: number;
  name?: string;
  video?: boolean;
  audio?: boolean;
  width?: number;
  height?: number;
}

interface ClipItem {
  id: string;
  name?: string;
  type?: string;
  video?: boolean;
  audio?: boolean;
  path?: string;
  src?: string;
  visible?: boolean;
  playing?: boolean;
  currentTime?: number;
  duration?: number;
  loop?: boolean;
  speed?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
  opacity?: number;
  volume?: number;
  muted?: boolean;
  transitionInEnabled?: boolean;
  transitionInDuration?: number;
  transitionOutEnabled?: boolean;
  transitionOutDuration?: number;
}

const router = Router();

router.get('/compositions', async (_req: Request, res: Response) => {
  try {
    const plugin = container.resolve<{ findCompositions: () => Promise<CompositionItem[]> }>('resolume');
    const compositions = await plugin.findCompositions();
    res.json({ compositions });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

router.get('/compositions/:compositionId/layers', async (req: Request, res: Response) => {
  try {
    const plugin = container.resolve<{ getRenderTree: (id: string) => Promise<{ layers: LayerItem[]; clips: ClipItem[][] }> }>('resolume');
    const tree = await plugin.getRenderTree(req.params.compositionId);
    res.json({ layers: tree.layers });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

router.get('/compositions/:compositionId/clips', async (req: Request, res: Response) => {
  try {
    const plugin = container.resolve<{ getRenderTree: (id: string) => Promise<{ layers: LayerItem[]; clips: ClipItem[][] }> }>('resolume');
    const tree = await plugin.getRenderTree(req.params.compositionId);
    res.json({ clips: tree.clips });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

export { router as ResolumeUIRouter };
