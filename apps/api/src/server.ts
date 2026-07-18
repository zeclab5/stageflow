import { createApp } from './app';
import path from 'path';
import { spawn } from 'child_process';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3101;

createApp()
  .then((app) => app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
    try {
      const watch = spawn('python3', ['scripts/sync/watch_content.py', 'watch', '--interval=2'], {
        cwd: path.join(__dirname, '..', '..'),
        stdio: 'ignore',
        detached: false,
      });
      watch.on('error', () => {});
    } catch {
      // sync watcher optional
    }
  }))
  .catch((error) => {
    console.error('Failed to start API server', error);
    process.exit(1);
  });

process.on('unhandledRejection', (reason) => { console.error('API unhandledRejection', reason); });
process.on('uncaughtException', (error) => { console.error('API uncaughtException', error); process.exit(1); });
process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0));
