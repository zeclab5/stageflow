import { SceneRepository } from '../../domain/scene/SceneRepository';
import { CreateScene, RenameScene, ReorderScene, DeleteScene, ActivateScene } from '../command/SceneCommand';
import { GetScene, ListScenes } from '../query/SceneQuery';
import type { SceneObjectRepository } from '../../domain/scene/SceneObjectRepository';

export class SceneService {
  constructor(private readonly repo: SceneRepository, private readonly objectRepo?: SceneObjectRepository) {}

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

  async placeObject(sceneId: string, payload: Partial<{ assetId: string; x: number; y: number; width: number; height: number; rotation: number; opacity: number; visible: boolean; layerIndex: number; outputs: string[] }>) {
    if (!this.objectRepo) throw new Error('object repo missing');
    const object = {
      id: crypto.randomUUID(),
      sceneId,
      assetId: String(payload.assetId ?? ''),
      x: Number(payload.x ?? 0),
      y: Number(payload.y ?? 0),
      width: Number(payload.width ?? 0),
      height: Number(payload.height ?? 0),
      rotation: Number(payload.rotation ?? 0),
      opacity: Number(payload.opacity ?? 1),
      visible: payload.visible ?? true,
      layerIndex: Number(payload.layerIndex ?? 0),
      outputs: Array.isArray(payload.outputs) ? payload.outputs.map(String) : []
    };
    await this.objectRepo.save(object);
    return object;
  }

  async activate(projectId: string, sceneId: string) {
    await new ActivateScene(this.repo, projectId).execute(sceneId);
  }
}
