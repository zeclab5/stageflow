import { SceneRepository } from '../../domain/scene/SceneRepository';
import { CreateScene, RenameScene, ReorderScene } from '../command/SceneCommand';
import { ListScenes } from '../query/SceneQuery';

export class SceneService {
  constructor(private readonly repo: SceneRepository) {}

  async create(projectId: string, name: string, order: number) {
    return new CreateScene(this.repo).execute(projectId, name, order);
  }

  async rename(id: string, name: string) {
    return new RenameScene(this.repo).execute(id, name);
  }

  async reorder(id: string, order: number) {
    return new ReorderScene(this.repo).execute(id, order);
  }

  async listByProject(projectId: string) {
    return new ListScenes(this.repo).execute(projectId);
  }
}
