export interface ScreenCreatedEvent {
  readonly eventType: 'ScreenCreated';
  readonly screenId: string;
  readonly projectId: string;
  readonly name: string;
  readonly occurredAt: Date;
}

export interface ScreenRenamedEvent {
  readonly eventType: 'ScreenRenamed';
  readonly screenId: string;
  readonly name: string;
  readonly occurredAt: Date;
}

export interface ScreenReorderedEvent {
  readonly eventType: 'ScreenReordered';
  readonly screenId: string;
  readonly order: number;
  readonly occurredAt: Date;
}

export interface ScreenDeletedEvent {
  readonly eventType: 'ScreenDeleted';
  readonly screenId: string;
  readonly occurredAt: Date;
}

export type ScreenEvent = ScreenCreatedEvent | ScreenRenamedEvent | ScreenReorderedEvent | ScreenDeletedEvent;
