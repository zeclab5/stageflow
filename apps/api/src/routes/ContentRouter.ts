import { Router } from 'express';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';

function makeScanRouter(dirName: 'works' | 'blog') {
  const router = Router();

  const scanMeta = (dir: string) => {
    if (!existsSync(dir)) return [];
    return readdirSync(dir)
      .filter(name => existsSync(join(dir, name, 'meta.json')))
      .map(name => {
        try {
          const meta = JSON.parse(readFileSync(join(dir, name, 'meta.json'), 'utf8'));
          return { slug: name, ...meta };
        } catch {
          return { slug: name };
        }
      });
  };

  router.get('/', (_req, res) => {
    const data = scanMeta(join(process.cwd(), `public/content/${dirName}`));
    res.status(200).json(data);
  });

  router.get('/:slug', (req, res) => {
    const data = scanMeta(join(process.cwd(), `public/content/${dirName}`));
    const item = data.find(x => x.slug === req.params.slug);
    if (!item) {
      return res.status(404).json({ error: 'not found' });
    }
    res.status(200).json(item);
  });

  return router;
}

export const WorksRouter = makeScanRouter('works');
export const BlogRouter = makeScanRouter('blog');
