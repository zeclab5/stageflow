export type SceneId = string;
export type ProjectId = string;
import { Scene } from './Scene';

export { Scene };
export interface SceneRepository {
  findById(id: SceneId): Promise<Scene | null>;
  save(scene: Scene): Promise<void>;
}
