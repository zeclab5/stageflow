export interface DomainEvent { readonly occurredAt: Date; }
export interface EventBus { publish(event: DomainEvent): Promise<void>; }
