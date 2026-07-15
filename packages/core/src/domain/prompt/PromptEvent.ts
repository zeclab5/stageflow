export interface PromptCreatedEvent {
  readonly eventType: 'PromptCreated';
  readonly promptId: string;
  readonly projectId: string;
  readonly occurredAt: Date;
}

export interface PromptUpdatedEvent {
  readonly eventType: 'PromptUpdated';
  readonly promptId: string;
  readonly template: string;
  readonly occurredAt: Date;
}

export type PromptEvent = PromptCreatedEvent | PromptUpdatedEvent;
