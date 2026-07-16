import { EventBus, DomainEvent, EventHandler } from './EventBus';

export class InMemoryEventBus implements EventBus {
  private published: DomainEvent[] = [];
  private handlers: Map<string, Set<EventHandler>> = new Map();

  async publish(event: DomainEvent): Promise<void> {
    this.published.push(event);
    const handlers = this.handlers.get(event.eventType);
    if (handlers) {
      const calls = Array.from(handlers).map(handler => {
        const result = handler(event);
        if (result && typeof result.then === 'function') {
          return result.catch(err => console.error('event handler error', err));
        }
        return null;
      });
      await Promise.all(calls.filter(Boolean));
    }
  }

  async publishAll(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }

  getAllPublished(): DomainEvent[] {
    return [...this.published];
  }

  subscribe(eventType: string, handler: EventHandler): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler);
  }
}
