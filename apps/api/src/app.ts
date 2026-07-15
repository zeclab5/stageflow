import express from 'express';
import { ProjectRouter } from './routes/ProjectRouter';
import { SceneRouter } from './routes/SceneRouter';
import { PromptRouter } from './routes/PromptRouter';
import { AssetRouter } from './routes/AssetRouter';
import { GenerationRouter } from './routes/GenerationRouter';
import { IntegrationRouter } from './routes/IntegrationRouter';
import { bootstrapContainer } from './container';

const app = express();
app.use(express.json());
app.use('/projects', ProjectRouter);
app.use('/scenes', SceneRouter);
app.use('/prompts', PromptRouter);
app.use('/assets', AssetRouter);
app.use('/generations', GenerationRouter);
app.use('/integrations', IntegrationRouter);

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
bootstrapContainer()
  .then(() => {
    app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
  })
  .catch(err => {
    console.error('bootstrap failed', err);
    process.exit(1);
  });

export { app };
