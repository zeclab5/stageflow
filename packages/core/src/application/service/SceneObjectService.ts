import type {} from '../../domain/scene/SceneObject';
import { SceneObjectRepository } from '../../domain/scene/SceneObjectRepository';
import { PlaceSceneObject, UpdateSceneObject, RemoveSceneObject } from '../../application/command/SceneObjectCommand';

export class SceneObjectService {
  constructor(private readonly repo: SceneObjectRepository) {}

  async place(data: { sceneId: string; assetId: string; x: number; y: number; width: number; height: number; rotation?: number; opacity?: number; visible?: boolean; layerIndex?: number }) {
    return new PlaceSceneObject(this.repo).execute(data);
  }

  async update(id: string, patch: { x?: number; y?: number; width?: number; height?: number; rotation?: number; opacity?: number; visible?: boolean; layerIndex?: number }) {
    return new UpdateSceneObject(this.repo).execute(id, patch);
  }

  async remove(id: string) {
    return new RemoveSceneObject(this.repo).execute(id);
  }

  async list(sceneId: string) {
    return this.repo.listByScene(sceneId);
  }
}
