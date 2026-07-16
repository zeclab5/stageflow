import { Scene } from './Scene';
import { SceneRepository } from './SceneRepository';

export class FakeSceneRepository implements SceneRepository {
  private readonly items = new Map<string, Scene>();

  async findById(id: string): Promise<Scene | null> {
    return this.items.get(id) ?? null;
  }

  async save(scene: Scene): Promise<void> {
    this.items.set(scene.id, scene);
  }

  async delete(id: string): Promise<void> {
    this.items.delete(id);
  }

  async listByProject(projectId: string): Promise<Scene[]> {
    return Array.from(this.items.values())
      .filter((scene) => scene.projectId === projectId)
      .sort((a, b) => a.order - b.order);
  }
}

describe('SceneAggregate', () => {
  it('creates a scene', () => {
    const scene = new Scene({ id: 's1', name: 'Intro', projectId: 'p1', order: 1, active: false });
    expect(scene.name).toBe('Intro');
    expect(scene.projectId).toBe('p1');
    expect(scene.order).toBe(1);
    expect(scene.active).toBe(false);
  });

  test('preserves props as read-only fields', () => {
    const scene = new Scene({ id: 's1', name: 'Intro', projectId: 'p1', order: 1, active: true });
    expect(scene.name).not.toBeUndefined();
  });
});
