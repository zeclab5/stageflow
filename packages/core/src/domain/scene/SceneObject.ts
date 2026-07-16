export type ScreenObjectId = string;
export type SceneId = string;
export interface SceneObjectProps { readonly id: ScreenObjectId; readonly sceneId: SceneId; readonly assetId: string; readonly x: number; readonly y: number; readonly width: number; readonly height: number; readonly rotation: number; readonly opacity: number; readonly visible: boolean; readonly layerIndex: number; }
export interface SceneObjectRepository { findById(id: ScreenObjectId): Promise<SceneObjectProps | undefined>; listByScene(sceneId: SceneId): Promise<SceneObjectProps[]>; save(object: SceneObjectProps): Promise<void>; delete(id: ScreenObjectId): Promise<void>; }
