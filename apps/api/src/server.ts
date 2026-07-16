import { createApp } from './app';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3101;

createApp()
  .then((app) => app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`)))
  .catch((error) => {
    console.error('Failed to start API server', error);
    process.exit(1);
  });

process.on('unhandledRejection', (reason) => { console.error('API unhandledRejection', reason); });
process.on('uncaughtException', (error) => { console.error('API uncaughtException', error); process.exit(1); });
process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0));
