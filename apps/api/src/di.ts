import { DIContainer } from '@core/infrastructure/di/Container';
import { SQLiteProjectRepository } from '@core/infrastructure/repository/SQLiteProjectRepository';
import { SQLiteSceneRepository } from '@core/infrastructure/repository/SQLiteSceneRepository';
import { SQLitePromptRepository } from '@core/infrastructure/repository/SQLitePromptRepository';
import { SQLiteAssetRepository } from '@core/infrastructure/repository/SQLiteAssetRepository';
import { SQLiteGenerationJobRepository } from '@core/infrastructure/repository/SQLiteGenerationJobRepository';
import { SQLiteIntegrationRepository } from '@core/infrastructure/repository/SQLiteIntegrationRepository';
import { SQLiteConnection } from '@core/infrastructure/persistence/sqlite/SQLiteConnection';
import { initializeDatabase } from '@core/infrastructure/persistence/sqlite/SQLiteProvider';

export const container = new DIContainer();

export async function bootstrap() {
  const db = await initializeDatabase('/tmp/stageflow-api.sqlite');
  container.register<SQLiteConnection>('db', () => db);

  container.register<SQLiteProjectRepository>('projectRepo', () => new SQLiteProjectRepository(db));
  container.register<SQLiteSceneRepository>('sceneRepo', () => new SQLiteSceneRepository(db));
  container.register<SQLitePromptRepository>('promptRepo', () => new SQLitePromptRepository(db));
  container.register<SQLiteAssetRepository>('assetRepo', () => new SQLiteAssetRepository(db));
  container.register<SQLiteGenerationJobRepository>('generationRepo', () => new SQLiteGenerationJobRepository(db));
  container.register<SQLiteIntegrationRepository>('integrationRepo', () => new SQLiteIntegrationRepository(db));
}
