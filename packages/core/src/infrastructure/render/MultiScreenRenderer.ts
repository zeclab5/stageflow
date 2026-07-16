import type { ScreenRenderTree, ScreenRenderNode, MultiScreenRenderResult } from '../../domain/render/RenderTree';
import type { SceneObjectProps } from '../../domain/scene/SceneObject';
import type { ScreenProps } from '../../domain/screen/Screen';

export class MultiScreenRenderer {
  build(result: MultiScreenRenderResult) {
    return result;
  }

  buildTrees(objects: SceneObjectProps[], screens: ScreenProps[], sceneId: string): MultiScreenRenderResult {
    const byScreen = new Map<string, SceneObjectProps[]>();
    for (const object of objects) {
      for (const screenId of object.outputs) {
        const list = byScreen.get(screenId) || [];
        list.push(object);
        byScreen.set(screenId, list);
      }
    }
    const fallback = screens[0]?.id || 'screen';
    const trees: ScreenRenderTree[] = screens.map((screen) => {
      const matched = byScreen.get(screen.id) || [];
      const sorted = matched.sort((a, b) => a.layerIndex - b.layerIndex || a.id.localeCompare(b.id));
      return {
        screenId: screen.id,
        projectId: screen.projectId,
        sceneId,
        resolution: screen.resolution,
        objects: sorted.map((object): ScreenRenderNode => ({
          id: object.id,
          assetId: object.assetId,
          x: object.x,
          y: object.y,
          width: object.width,
          height: object.height,
          rotation: object.rotation,
          opacity: object.opacity,
          visible: object.visible,
          layerIndex: object.layerIndex,
          children: [],
        })),
        generatedAt: new Date(),
      };
    });
    if (!trees.length) {
      trees.push({
        screenId: fallback,
        projectId: '',
        sceneId,
        resolution: { width: 1920, height: 1080 },
        objects: [],
        generatedAt: new Date(),
      });
    }
    const projectId = screens[0]?.projectId || '';
    return { projectId, sceneId, trees };
  }
}
