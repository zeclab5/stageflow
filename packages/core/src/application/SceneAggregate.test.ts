import { Scene, SceneId, SceneRepository } from '../domain/scene/SceneRepository';
import { CreateScene, RenameScene, ReorderScene } from './command/SceneCommand';
import { GetScene, ListScenes } from './query/SceneQuery';

class FakeSceneRepository implements Partial<SceneRepository> {
  saved: Scene[] = [];
  async findById(id: SceneId): Promise<Scene | null> {
    return this.saved.find(s => s.id === id) ?? null;
  }
  async save(scene: Scene): Promise<void> {
    this.saved = [...this.saved.filter(s => s.id !== scene.id), scene];
  }
}

describe('Scene Aggregate', () => {
  let repo: FakeSceneRepository;
  let create: CreateScene;
  let rename: RenameScene;
  let reorder: ReorderScene;
  let get: GetScene;
  let list: ListScenes;

  beforeEach(() => {
    repo = new FakeSceneRepository();
    create = new CreateScene(repo);
    rename = new RenameScene(repo);
    reorder = new ReorderScene(repo);
    get = new GetScene(repo);
    list = new ListScenes(repo);
  });

  test('create requires name', async () => {
    await expect(create.execute('project-1', '', 1)).rejects.toThrow('scene name is required');
    await expect(create.execute('project-1', '   ', 1)).rejects.toThrow('scene name is required');
  });

  test('create requires order >= 1', async () => {
    await expect(create.execute('project-1', 'intro', 0)).rejects.toThrow('scene order must be >= 1');
  });

  test('create returns scene', async () => {
    const scene = await create.execute('project-1', 'intro', 1);
    expect(scene.projectId).toBe('project-1');
    expect(scene.name).toBe('intro');
    expect(scene.order).toBe(1);
  });

  test('rename changes name', async () => {
    const scene = await create.execute('project-1', 'intro', 1);
    const updated = await rename.execute(scene.id, 'opening');
    expect(updated.name).toBe('opening');
  });

  test('rename requires name', async () => {
    const scene = await create.execute('project-1', 'intro', 1);
    await expect(rename.execute(scene.id, '')).rejects.toThrow('scene name is required');
  });

  test('reorder changes order', async () => {
    const scene = await create.execute('project-1', 'intro', 1);
    const updated = await reorder.execute(scene.id, 2);
    expect(updated.order).toBe(2);
  });

  test('reorder requires order >= 1', async () => {
    const scene = await create.execute('project-1', 'intro', 1);
    await expect(reorder.execute(scene.id, -1)).rejects.toThrow('scene order must be >= 1');
  });

  test('get scene by id', async () => {
    const scene = await create.execute('project-1', 'intro', 1);
    const found = await get.execute(scene.id);
    expect(found.id).toBe(scene.id);
  });

  test('list returns empty until implementation', async () => {
    await create.execute('project-1', 'intro', 1);
    expect(await list.execute('project-1')).toHaveLength(0);
  });
});
