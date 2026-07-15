export interface IntegrationCreatedEvent {
  readonly eventType: 'IntegrationCreated';
  readonly integrationId: string;
  readonly name: string;
  readonly type: string;
  readonly occurredAt: Date;
}

export interface IntegrationActivatedEvent {
  readonly eventType: 'IntegrationActivated';
  readonly integrationId: string;
  readonly occurredAt: Date;
}

export interface IntegrationSuspendedEvent {
  readonly eventType: 'IntegrationSuspended';
  readonly integrationId: string;
  readonly occurredAt: Date;
}

export type IntegrationEvent = IntegrationCreatedEvent | IntegrationActivatedEvent | IntegrationSuspendedEvent;
