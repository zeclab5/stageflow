import { Router } from 'express';
import { container } from '../container';

const router = Router();

const resolveService = (name: string) => container.resolve<{ get: (id: string) => Promise<unknown> }>(name);

router.get('/:kind/:id', async (req, res) => {
  const { kind, id } = req.params;
  try {
    switch (kind) {
      case 'project':
        return res.json(await resolveService('ProjectService').get(id));
      case 'scene':
        return res.json(await resolveService('SceneService').get(id));
      case 'screen':
        return res.json(await resolveService('ScreenService').get(id));
      case 'asset':
        return res.json(await resolveService('AssetService').get(id));
      default:
        return res.status(400).json({ error: 'unknown kind' });
    }
  } catch {
    return res.status(404).json({ error: 'not found' });
  }
});

export { router as InspectorRouter };
