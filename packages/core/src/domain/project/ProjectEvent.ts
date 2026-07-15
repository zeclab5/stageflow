export interface ProjectCreatedEvent {
  readonly eventType: 'ProjectCreated';
  readonly projectId: string;
  readonly name: string;
  readonly occurredAt: Date;
}

export interface ProjectClosedEvent {
  readonly eventType: 'ProjectClosed';
  readonly projectId: string;
  readonly occurredAt: Date;
}

export type ProjectEvent = ProjectCreatedEvent | ProjectClosedEvent;
