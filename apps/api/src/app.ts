import express from 'express';
import { ProjectRouter } from './routes/ProjectRouter';
import { SceneRouter } from './routes/SceneRouter';
import { PromptRouter } from './routes/PromptRouter';
import { AssetRouter } from './routes/AssetRouter';
import { GenerationRouter } from './routes/GenerationRouter';
import { IntegrationRouter } from './routes/IntegrationRouter';
import { PluginsRouter } from './routes/PluginsRouter';
import { WorksRouter, BlogRouter } from './routes/ContentRouter';
import { bootstrapContainer } from './container';
import { requiredApiKey } from './auth';
import { errorHandler } from './errors';

export async function createApp() {
  await bootstrapContainer();

  const app = express();
  app.use(express.json());
  app.use(requiredApiKey);
  app.use('/projects', ProjectRouter);
  app.use('/scenes', SceneRouter);
  app.use('/prompts', PromptRouter);
  app.use('/assets', AssetRouter);
  app.use('/generations', GenerationRouter);
  app.use('/integrations', IntegrationRouter);
  app.use('/api/plugins', PluginsRouter);
  app.use('/api/works', WorksRouter);
  app.use('/api/blog', BlogRouter);
  app.use(errorHandler);
  return app;
}

export const app = express();
app.use(express.json());
app.use('/projects', ProjectRouter);
app.use('/scenes', SceneRouter);
app.use('/prompts', PromptRouter);
app.use('/assets', AssetRouter);
app.use('/generations', GenerationRouter);
app.use('/integrations', IntegrationRouter);
app.use('/api/plugins', PluginsRouter);
app.use('/api/works', WorksRouter);
app.use('/api/blog', BlogRouter);
app.use(errorHandler);

if (!process.env.JEST_WORKER_ID) {
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
  bootstrapContainer().catch(err => console.error('bootstrap failed', err));
}
