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

export type SceneEvent = SceneCreatedEvent | SceneRenamedEvent | SceneReorderedEvent;
