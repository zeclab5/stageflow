export interface DomainEvent { readonly occurredAt: Date; readonly eventType: string; }
export type EventHandler = (event: DomainEvent) => Promise<void> | void;
export interface EventBus {
  publish(event: DomainEvent): Promise<void>;
  publishAll(events: DomainEvent[]): Promise<void>;
  subscribe(eventType: string, handler: EventHandler): void;
}

