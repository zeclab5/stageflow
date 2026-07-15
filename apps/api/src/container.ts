import { DIContainer } from 'stageflow-core';
import { SQLiteProjectRepository, SQLiteSceneRepository, SQLitePromptRepository, SQLiteAssetRepository, SQLiteGenerationJobRepository, SQLiteIntegrationRepository } from 'stageflow-core';
import { ProjectService, SceneService, PromptService, AssetService, GenerationService, IntegrationService } from 'stageflow-core';
import { PluginRegistry } from 'stageflow-core';
import { healthPluginDescriptor } from './plugins/HealthPlugin';
import { initializeDatabase } from 'stageflow-core';

export const container = new DIContainer();
export const pluginRegistry = new PluginRegistry();

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

  container.register('ProjectService', () => new ProjectService(projectRepo));
  container.register('SceneService', () => new SceneService(sceneRepo));
  container.register('PromptService', () => new PromptService(promptRepo));
  container.register('AssetService', () => new AssetService(assetRepo));
  container.register('GenerationService', () => new GenerationService(generationRepo));
  container.register('IntegrationService', () => new IntegrationService(integrationRepo));

  pluginRegistry.registerDescriptor(healthPluginDescriptor);
  await pluginRegistry.load('health');
}
