export type RenderObjectId = string;
export type ScreenRenderId = string;

export interface ScreenRenderNode {
  readonly id: RenderObjectId;
  readonly assetId: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly rotation: number;
  readonly opacity: number;
  readonly visible: boolean;
  readonly layerIndex: number;
  readonly children?: ScreenRenderNode[];
}

export interface ScreenRenderTree {
  readonly screenId: ScreenRenderId;
  readonly projectId: string;
  readonly sceneId: string;
  readonly resolution: { width: number; height: number };
  readonly objects: ScreenRenderNode[];
  readonly generatedAt: Date;
}

export interface MultiScreenRenderResult {
  readonly projectId: string;
  readonly sceneId: string;
  readonly trees: ScreenRenderTree[];
}
