import { DIContainer } from 'stageflow-core';
import { SQLiteProjectRepository, SQLiteSceneRepository, SQLitePromptRepository, SQLiteAssetRepository, SQLiteGenerationJobRepository, SQLiteIntegrationRepository } from 'stageflow-core';
import { CreateProject, CloseProject } from 'stageflow-core';
import { UpdateProject } from 'stageflow-core';
import { GetProject, ListProjects } from 'stageflow-core';
import { CreateScene, RenameScene, ReorderScene } from 'stageflow-core';
import { ListScenes } from 'stageflow-core';
import { CreatePrompt, UpdatePromptTemplate } from 'stageflow-core';
import { ListPrompts } from 'stageflow-core';
import { RegisterAsset, RetireAsset } from 'stageflow-core';
import { ListAssets } from 'stageflow-core';
import { CreateGenerationJob, UpdateGenerationStatus, AttachGenerationOutput } from 'stageflow-core';
import { GetGeneration, ListGenerations } from 'stageflow-core';
import { CreateIntegrationProfile, ActivateIntegration, SuspendIntegration } from 'stageflow-core';
import { GetIntegration, ListIntegrations } from 'stageflow-core';
import { initializeDatabase } from 'stageflow-core';

export const container = new DIContainer();

let bootstrapped = false;

export async function bootstrapContainer() {
  if (bootstrapped) return;
  bootstrapped = true;

  const db = await initializeDatabase('/tmp/stageflow-api.sqlite');

  const projectRepo = new SQLiteProjectRepository(db);
  const sceneRepo = new SQLiteSceneRepository(db);
  const promptRepo = new SQLitePromptRepository(db);
  const assetRepo = new SQLiteAssetRepository(db);
  const generationRepo = new SQLiteGenerationJobRepository(db);
  const integrationRepo = new SQLiteIntegrationRepository(db);

  container.register('ProjectRepo', () => projectRepo);
  container.register('CreateProject', () => new CreateProject(projectRepo));
  container.register('UpdateProject', () => new UpdateProject(projectRepo));
  container.register('CloseProject', () => new CloseProject(projectRepo));
  container.register('GetProject', () => new GetProject(projectRepo));
  container.register('ListProjects', () => new ListProjects(projectRepo));

  container.register('SceneRepo', () => sceneRepo);
  container.register('CreateScene', () => new CreateScene(sceneRepo));
  container.register('RenameScene', () => new RenameScene(sceneRepo));
  container.register('ReorderScene', () => new ReorderScene(sceneRepo));
  container.register('ListScenes', () => new ListScenes(sceneRepo));

  container.register('PromptRepo', () => promptRepo);
  container.register('CreatePrompt', () => new CreatePrompt(promptRepo));
  container.register('UpdatePromptTemplate', () => new UpdatePromptTemplate(promptRepo));
  container.register('ListPrompts', () => new ListPrompts(promptRepo));

  container.register('AssetRepo', () => assetRepo);
  container.register('RegisterAsset', () => new RegisterAsset(assetRepo));
  container.register('RetireAsset', () => new RetireAsset(assetRepo));
  container.register('ListAssets', () => new ListAssets(assetRepo));

  container.register('GenerationRepo', () => generationRepo);
  container.register('CreateGenerationJob', () => new CreateGenerationJob(generationRepo));
  container.register('UpdateGenerationStatus', () => new UpdateGenerationStatus(generationRepo));
  container.register('AttachGenerationOutput', () => new AttachGenerationOutput(generationRepo));
  container.register('GetGeneration', () => new GetGeneration(generationRepo));
  container.register('ListGenerations', () => new ListGenerations(generationRepo));

  container.register('IntegrationRepo', () => integrationRepo);
  container.register('CreateIntegrationProfile', () => new CreateIntegrationProfile(integrationRepo));
  container.register('ActivateIntegration', () => new ActivateIntegration(integrationRepo));
  container.register('SuspendIntegration', () => new SuspendIntegration(integrationRepo));
  container.register('GetIntegration', () => new GetIntegration(integrationRepo));
  container.register('ListIntegrations', () => new ListIntegrations(integrationRepo));
}
