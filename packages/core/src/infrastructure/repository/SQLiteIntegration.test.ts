import { SQLiteProjectRepository } from '../repository/SQLiteProjectRepository';
import { SQLiteSceneRepository } from '../repository/SQLiteSceneRepository';
import { SQLitePromptRepository } from '../repository/SQLitePromptRepository';
import { Prompt as PromptModel } from '../../domain/prompt/PromptTemplate';
import { SQLiteAssetRepository } from '../repository/SQLiteAssetRepository';
import { SQLiteGenerationJobRepository } from '../repository/SQLiteGenerationJobRepository';
import { SQLiteIntegrationRepository } from '../repository/SQLiteIntegrationRepository';
import { Project } from '../../domain/project/Project';
import { Scene } from '../../domain/scene/Scene';
import { initializeDatabase } from '../persistence/sqlite/SQLiteProvider';

describe('SQLite integration', () => {
  let db: Awaited<ReturnType<typeof initializeDatabase>>;

  beforeAll(async () => {
    db = await initializeDatabase(':memory:');
  }, 20000);

  afterAll(async () => {
    await db.close();
  });

  it('saves and loads a project', async () => {
    const repo = new SQLiteProjectRepository(db);
    const project = new Project({ id: 'p1', name: 'stage show', status: 'active' });
    await repo.save(project);
    const loaded = await repo.findById('p1');
    expect(loaded).toBeInstanceOf(Project);
    expect(loaded?.id).toBe('p1');
    expect(loaded?.name).toBe('stage show');
    expect(loaded?.status).toBe('active');
  });

  it('saves and loads scenes', async () => {
    const repo = new SQLiteSceneRepository(db);
    const scene = { id: 's1', projectId: 'p1', name: 'opening', order: 1 };
    await repo.save(scene);
    const loaded = await repo.findById('s1');
    expect(loaded).not.toBeNull();
    if (!loaded) { return; }
    expect(loaded.id).toBe('s1');
    expect(loaded.projectId).toBe('p1');
    expect(loaded.name).toBe('opening');
  });

  it('saves and loads prompts', async () => {
    const repo = new SQLitePromptRepository(db);
    const prompt = new PromptModel({ id: 'pr1', projectId: 'p1', template: 'scene: {name}', variables: {}, version: 1 });
    await repo.save(prompt);
    const loaded = await repo.findById('pr1');
    expect(loaded).not.toBeNull();
    if (!loaded) { return; }
    expect(loaded.id).toBe('pr1');
    expect(loaded.template).toBe('scene: {name}');
    expect(loaded.variables).toEqual({});
  });

  it('saves and loads assets', async () => {
    const repo = new SQLiteAssetRepository(db);
    const asset = { id: 'a1', projectId: 'p1', name: 'a1', type: 'image' as const, uri: 's3://a.jpg' };
    await repo.save(asset as unknown as import('../../domain/asset/Asset').Asset);
    const loaded = await repo.findById('a1');
    expect(loaded).not.toBeNull();
    if (!loaded) { return; }
    expect(loaded.id).toBe('a1');
    expect(loaded.type).toBe('image');
    expect(loaded.uri).toBe('s3://a.jpg');
  });

  it('saves and loads generation jobs', async () => {
    const repo = new SQLiteGenerationJobRepository(db);
    const generation = { id: 'g1', projectId: 'p1', sceneId: 's1', promptId: 'pr1', providerRef: 'dummy', params: {}, status: 'requested' as const, outputUri: '' };
    await repo.save(generation);
    const loaded = await repo.findById('g1');
    expect(loaded).not.toBeNull();
    if (!loaded) { return; }
    expect(loaded.id).toBe('g1');
    expect(loaded.providerRef).toBe('dummy');
    expect(loaded.status).toBe('requested');
  });

  it('saves and loads integrations', async () => {
    const repo = new SQLiteIntegrationRepository(db);
    const integration = { id: 'i1', name: 'Resolume', type: 'resolume', config: {}, status: 'connected' as const };
    await repo.save(integration);
    const loaded = await repo.findById('i1');
    expect(loaded).not.toBeNull();
    if (!loaded) { return; }
    expect(loaded.id).toBe('i1');
    expect(loaded.type).toBe('resolume');
    expect(loaded.status).toBe('connected');
  });
});
