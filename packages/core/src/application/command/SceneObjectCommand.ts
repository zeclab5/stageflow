import { SceneObjectCreatedEvent, SceneObjectUpdatedEvent, SceneObjectRemovedEvent } from '../../domain/scene/SceneEvent';
import { SceneObjectRepository } from '../../domain/scene/SceneObjectRepository';
import type { SceneObjectProps, SceneId } from '../../domain/scene/SceneObject';

export class PlaceSceneObject {
  constructor(
    private readonly repo: SceneObjectRepository,
    private readonly eventBus?: unknown
  ) {}

  async execute(data: { sceneId: string; assetId: string; x: number; y: number; width: number; height: number; rotation?: number; opacity?: number; visible?: boolean; layerIndex?: number }) {
    const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    const object = { ...data, id } as SceneObjectProps;
    await this.repo.save(object);
    if (this.eventBus && typeof (this.eventBus as { publish?: (event: unknown) => Promise<void> }).publish === 'function') {
      await (this.eventBus as { publish: (event: SceneObjectCreatedEvent) => Promise<void> }).publish({ eventType: 'SceneObjectCreated', objectId: id, sceneId: data.sceneId, assetId: data.assetId, occurredAt: new Date() });
    }
    return object;
  }
}

export class UpdateSceneObject {
  constructor(
    private readonly repo: SceneObjectRepository,
    private readonly eventBus?: unknown
  ) {}

  async execute(id: string, patch: { x?: number; y?: number; width?: number; height?: number; rotation?: number; opacity?: number; visible?: boolean; layerIndex?: number }) {
    const object = await this.repo.findById(id);
    if (!object) throw new Error('scene object not found');
    const updated = { ...object, ...patch } as SceneObjectProps;
    await this.repo.save(updated);
    if (this.eventBus && typeof (this.eventBus as { publish?: (event: unknown) => Promise<void> }).publish === 'function') {
      await (this.eventBus as { publish: (event: SceneObjectUpdatedEvent) => Promise<void> }).publish({ eventType: 'SceneObjectUpdated', objectId: id, sceneId: object.sceneId, assetId: object.assetId, occurredAt: new Date() });
    }
    return updated;
  }
}

export class RemoveSceneObject {
  constructor(private readonly repo: SceneObjectRepository, private readonly eventBus?: unknown) {}

  async execute(id: string) {
    const existing = await this.repo.findById(id);
    await this.repo.delete(id);
    if (existing && this.eventBus && typeof (this.eventBus as { publish?: (event: unknown) => Promise<void> }).publish === 'function') {
      await (this.eventBus as { publish: (event: SceneObjectRemovedEvent) => Promise<void> }).publish({ eventType: 'SceneObjectRemoved', objectId: id, sceneId: existing.sceneId, occurredAt: new Date() });
    }
    return { id };
  }
}

export class ListSceneObjects {
  constructor(private readonly repo: SceneObjectRepository) {}

  async execute(sceneId: SceneId) {
    return this.repo.listByScene(sceneId);
  }
}
