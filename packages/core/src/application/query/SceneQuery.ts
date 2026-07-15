import { Scene, SceneRepository } from '../../domain/scene/SceneRepository';

export class GetScene {
  constructor(private readonly repo: SceneRepository) {}

  async execute(id: string) {
    const scene = await this.repo.findById(id);
    if (!scene) throw new Error('scene not found');
    return scene;
  }
}

export class ListScenes {
  constructor(private readonly repo: SceneRepository) {}

  async execute(_projectId: string): Promise<Scene[]> {
    void _projectId;
    return [];
  }
}
