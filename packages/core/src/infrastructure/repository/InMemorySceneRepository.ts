import { Scene, SceneId, SceneRepository } from '../../domain/scene/SceneRepository';

export class InMemorySceneRepository implements SceneRepository {
  private readonly items = new Map<SceneId, Scene>();

  async findById(id: SceneId): Promise<Scene | null> {
    return this.items.get(id) ?? null;
  }

  async save(scene: Scene): Promise<void> {
    this.items.set(scene.id, scene);
  }

  async delete(id: SceneId): Promise<void> {
    this.items.delete(id);
  }

  async listByProject(projectId: string): Promise<Scene[]> {
    return Array.from(this.items.values())
      .filter((scene) => scene.projectId === projectId)
      .sort((a, b) => a.order - b.order);
  }
}
