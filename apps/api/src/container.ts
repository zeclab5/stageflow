import { existsSync, unlinkSync } from 'fs';
import { DIContainer, PluginRegistry, initializeDatabase, discoverPluginManifests, resolvePluginEntryPath } from 'stageflow-core';
import { SQLiteProjectRepository, SQLiteSceneRepository, SQLitePromptRepository, SQLiteAssetRepository, SQLiteGenerationJobRepository, SQLiteIntegrationRepository, SQLiteCueRepository, SQLiteScreenRepository, SQLiteSceneObjectRepository } from 'stageflow-core';
import { ProjectService, SceneService, PromptService, AssetService, GenerationService, IntegrationService, CueService, ScreenService, SceneObjectService } from 'stageflow-core';
import { healthPluginDescriptor } from './plugins/HealthPlugin';

export const container = new DIContainer();
export const pluginRegistry = new PluginRegistry();

let bootstrapped = false;

export async function bootstrapContainer() {
  if (bootstrapped) return;
  bootstrapped = true;

  const defaultPath = '/tmp/stageflow-api.sqlite';
  const fallbackPath = '/tmp/stageflow-api-' + process.pid + '.sqlite';
  let dbPath = defaultPath;
  try {
    if (existsSync(defaultPath)) {
      unlinkSync(defaultPath);
    }
    await initializeDatabase(defaultPath);
  } catch {
    dbPath = fallbackPath;
  }
  const db = await initializeDatabase(dbPath);

  const projectRepo = new SQLiteProjectRepository(db);
  const sceneRepo = new SQLiteSceneRepository(db);
  const promptRepo = new SQLitePromptRepository(db);
  const assetRepo = new SQLiteAssetRepository(db);
  const generationRepo = new SQLiteGenerationJobRepository(db);
  const integrationRepo = new SQLiteIntegrationRepository(db);
  const cueRepo = new SQLiteCueRepository(db);
  const screenRepo = new SQLiteScreenRepository(db);
  const objectRepo = new SQLiteSceneObjectRepository(db);

  container.register('ProjectService', () => new ProjectService(projectRepo));
  container.register('SceneService', () => new SceneService(sceneRepo, objectRepo));
  container.register('PromptService', () => new PromptService(promptRepo));
  container.register('AssetService', () => new AssetService(assetRepo));
  container.register('GenerationService', () => new GenerationService(generationRepo));
  container.register('IntegrationService', () => new IntegrationService(integrationRepo));
  container.register('CueService', () => new CueService(cueRepo));
  container.register('ScreenService', () => new ScreenService(screenRepo));
  container.register('SceneObjectService', () => new SceneObjectService(objectRepo));
  container.register('SQLiteProjectRepository', () => projectRepo);
  container.register('SQLiteSceneRepository', () => sceneRepo);
  container.register('SQLitePromptRepository', () => promptRepo);
  container.register('SQLiteAssetRepository', () => assetRepo);
  container.register('SQLiteGenerationJobRepository', () => generationRepo);
  container.register('SQLiteIntegrationRepository', () => integrationRepo);
  container.register('SQLiteCueRepository', () => cueRepo);
  container.register('SQLiteScreenRepository', () => screenRepo);
  container.register('SQLiteSceneObjectRepository', () => objectRepo);

  pluginRegistry.registerDescriptor(healthPluginDescriptor);

  for (const manifest of discoverPluginManifests()) {
    if (pluginRegistry.getManifest(manifest.name)) continue;
    const entry = resolvePluginEntryPath(manifest);
    try {
      const mod = await import(entry);
      const create = mod.default?.create ?? mod.create;
      if (typeof create === 'function') {
        pluginRegistry.registerDescriptor({
          manifest: {
            name: manifest.name,
            version: manifest.version ?? '0.0.0',
            description: manifest.description,
            category: manifest.category ?? 'integration',
          },
          create: async (config) => create(config),
        });
      }
    } catch {
      // leave discovery to manual activation
    }
  }

  await pluginRegistry.load('health');
}
