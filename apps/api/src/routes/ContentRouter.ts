import { Router } from 'express';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';

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

router.get('/works', (_req, res) => {
  const data = scanMeta(join(process.cwd(), 'public/content/works'));
  res.json(data);
});

router.get('/blog', (_req, res) => {
  const data = scanMeta(join(process.cwd(), 'public/content/blog'));
  res.json(data);
});

export { router as ContentRouter };
