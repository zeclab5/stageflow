import type { SceneObjectProps } from './SceneObject';

export type { SceneId } from './SceneObject';
export type ScreenObjectId = string;

export interface SceneObjectRepository {
  findById(id: string): Promise<SceneObjectProps | undefined>;
  listByScene(sceneId: string): Promise<SceneObjectProps[]>;
  save(object: SceneObjectProps): Promise<void>;
  delete(id: string): Promise<void>;
}
