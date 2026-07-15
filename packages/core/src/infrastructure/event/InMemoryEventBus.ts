import { EventBus, DomainEvent } from './EventBus';

export class InMemoryEventBus implements EventBus {
  private published: DomainEvent[] = [];

  async publish(event: DomainEvent): Promise<void> {
    this.published.push(event);
  }

  async publishAll(events: DomainEvent[]): Promise<void> {
    this.published.push(...events);
  }

  getAllPublished(): DomainEvent[] {
    return [...this.published];
  }
}
