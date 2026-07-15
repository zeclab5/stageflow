import { DIContainer } from 'stageflow-core';
import { SQLiteProjectRepository } from 'stageflow-core';
import { SQLiteSceneRepository } from 'stageflow-core';
import { SQLitePromptRepository } from 'stageflow-core';
import { SQLiteAssetRepository } from 'stageflow-core';
import { SQLiteGenerationJobRepository } from 'stageflow-core';
import { SQLiteIntegrationRepository } from 'stageflow-core';
import { SQLiteConnection } from 'stageflow-core';
import { initializeDatabase } from 'stageflow-core';
import { config } from './config';

export const container = new DIContainer();

export async function bootstrap() {
  const db = await initializeDatabase(config.dbPath);
  container.register<SQLiteConnection>('db', () => db);

  container.register<SQLiteProjectRepository>('projectRepo', () => new SQLiteProjectRepository(db));
  container.register<SQLiteSceneRepository>('sceneRepo', () => new SQLiteSceneRepository(db));
  container.register<SQLitePromptRepository>('promptRepo', () => new SQLitePromptRepository(db));
  container.register<SQLiteAssetRepository>('assetRepo', () => new SQLiteAssetRepository(db));
  container.register<SQLiteGenerationJobRepository>('generationRepo', () => new SQLiteGenerationJobRepository(db));
  container.register<SQLiteIntegrationRepository>('integrationRepo', () => new SQLiteIntegrationRepository(db));
}
