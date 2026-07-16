export interface SceneCreatedEvent {
  readonly eventType: 'SceneCreated';
  readonly sceneId: string;
  readonly projectId: string;
  readonly name: string;
  readonly occurredAt: Date;
}

export interface SceneRenamedEvent {
  readonly eventType: 'SceneRenamed';
  readonly sceneId: string;
  readonly name: string;
  readonly occurredAt: Date;
}

export interface SceneReorderedEvent {
  readonly eventType: 'SceneReordered';
  readonly sceneId: string;
  readonly order: number;
  readonly occurredAt: Date;
}

export interface SceneDeletedEvent {
  readonly eventType: 'SceneDeleted';
  readonly sceneId: string;
  readonly occurredAt: Date;
}

export interface SceneObjectCreatedEvent {
  readonly eventType: 'SceneObjectCreated';
  readonly objectId: string;
  readonly sceneId: string;
  readonly assetId: string;
  readonly occurredAt: Date;
}

export interface SceneObjectUpdatedEvent {
  readonly eventType: 'SceneObjectUpdated';
  readonly objectId: string;
  readonly sceneId: string;
  readonly assetId: string;
  readonly occurredAt: Date;
}

export interface SceneObjectRemovedEvent {
  readonly eventType: 'SceneObjectRemoved';
  readonly objectId: string;
  readonly sceneId: string;
  readonly occurredAt: Date;
}

export type SceneEvent = SceneCreatedEvent | SceneRenamedEvent | SceneReorderedEvent | SceneDeletedEvent | SceneObjectCreatedEvent | SceneObjectUpdatedEvent | SceneObjectRemovedEvent;
