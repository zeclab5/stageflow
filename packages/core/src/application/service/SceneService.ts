import { SceneRepository } from '../../domain/scene/SceneRepository';
import { CreateScene, RenameScene, ReorderScene, DeleteScene } from '../command/SceneCommand';
import { GetScene, ListScenes } from '../query/SceneQuery';

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

  async remove(id: string) {
    return new DeleteScene(this.repo).execute(id);
  }

  async listByProject(projectId: string) {
    return new ListScenes(this.repo).execute(projectId);
  }

  async get(id: string) {
    return new GetScene(this.repo).execute(id);
  }
}
