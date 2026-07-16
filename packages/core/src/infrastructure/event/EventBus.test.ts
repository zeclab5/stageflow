import { DomainEvent } from './EventBus';
import { InMemoryEventBus } from './InMemoryEventBus';

describe('InMemoryEventBus', () => {
  test('publishes single event', async () => {
    const bus = new InMemoryEventBus();
    const event: DomainEvent = { occurredAt: new Date(), eventType: 'TestEvent' };
    await bus.publish(event);
    expect(bus.getAllPublished()).toHaveLength(1);
  });

  test('publishes multiple events', async () => {
    const bus = new InMemoryEventBus();
    const events: DomainEvent[] = [
      { occurredAt: new Date(), eventType: 'TestEventA' },
      { occurredAt: new Date(), eventType: 'TestEventB' }
    ];
    await bus.publishAll(events);
    expect(bus.getAllPublished()).toHaveLength(2);
  });
});
