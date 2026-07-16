import { createApp } from './app';

async function main() {
  const app = await createApp();
  const port = process.env.PORT ? Number(process.env.PORT) : 3101;
  app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
}

main().catch(err => console.error('bootstrap failed', err));
