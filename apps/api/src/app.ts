import express from 'express';
import { ProjectRouter } from './routes/ProjectRouter';
import { SceneRouter } from './routes/SceneRouter';
import { PromptRouter } from './routes/PromptRouter';
import { AssetRouter } from './routes/AssetRouter';
import { GenerationRouter } from './routes/GenerationRouter';
import { IntegrationRouter } from './routes/IntegrationRouter';
import { PluginsRouter } from './routes/PluginsRouter';
import { WorksRouter, BlogRouter } from './routes/ContentRouter';
import { CueRouter } from './routes/CueRouter';
import { PipelineRouter } from './routes/PipelineRouter';
import { ResolumeRouter } from './routes/ResolumeRouter';
import { ScreenRouter } from './routes/ScreenRouter';
import { InspectorRouter } from './routes/InspectorRouter';
import { PlaybackRouter } from './routes/PlaybackRouter';
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
  app.use('/cues', CueRouter);
  app.use('/api/pipeline', PipelineRouter);
  app.use('/api/resolume', ResolumeRouter);
  app.use('/screens', ScreenRouter);
  app.use('/inspector', InspectorRouter);
  app.use('/api/playback', PlaybackRouter);
  app.use('/api/plugins', PluginsRouter);
  app.use('/api/works', WorksRouter);
  app.use('/api/blog', BlogRouter);
  app.use(errorHandler);
  return app;
}
