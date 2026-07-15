import { Scene, SceneId, SceneRepository } from '../../domain/scene/SceneRepository';

export class CreateScene {
  constructor(private readonly repo: SceneRepository) {}

  async execute(projectId: string, name: string, order: number): Promise<Scene> {
    if (!name || !name.trim()) throw new Error('scene name is required');
    if (!Number.isInteger(order) || order < 1) throw new Error('scene order must be >= 1');

    const scene = new Scene({
      id: crypto.randomUUID(),
      projectId,
      name: name.trim(),
      order
    });

    await this.repo.save(scene);
    return scene;
  }
}

export class RenameScene {
  constructor(private readonly repo: SceneRepository) {}

  async execute(id: SceneId, name: string): Promise<Scene> {
    const scene = await this.repo.findById(id);
    if (!scene) throw new Error('scene not found');
    if (!name || !name.trim()) throw new Error('scene name is required');

    const updated = new Scene({
      id: scene.id,
      projectId: scene.projectId,
      name: name.trim(),
      order: scene.order
    });

    await this.repo.save(updated);
    return updated;
  }
}

export class ReorderScene {
  constructor(private readonly repo: SceneRepository) {}

  async execute(id: SceneId, order: number): Promise<Scene> {
    const scene = await this.repo.findById(id);
    if (!scene) throw new Error('scene not found');
    if (!Number.isInteger(order) || order < 1) throw new Error('scene order must be >= 1');

    const updated = new Scene({
      id: scene.id,
      projectId: scene.projectId,
      name: scene.name,
      order
    });

    await this.repo.save(updated);
    return updated;
  }
}
