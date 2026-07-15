import { IntegrationProfile, IntegrationId, IntegrationRepository } from '../../domain/integration/IntegrationProfile';
import { EventBus } from '../../infrastructure/event/EventBus';
import { IntegrationCreatedEvent, IntegrationActivatedEvent, IntegrationSuspendedEvent } from '../../domain/integration/IntegrationEvent';

export class CreateIntegrationProfile {
  constructor(
    private readonly repo: IntegrationRepository,
    private readonly eventBus?: EventBus
  ) {}

  async execute(name: string, type: string, config: Record<string, string>): Promise<IntegrationProfile> {
    const integration = new IntegrationProfile({
      id: crypto.randomUUID(),
      name,
      type,
      config,
      status: 'disconnected'
    });
    await this.repo.save(integration);

    if (this.eventBus) {
      await this.eventBus.publish({
        eventType: 'IntegrationCreated',
        integrationId: integration.id,
        name: integration.name,
        type: integration.type,
        occurredAt: new Date()
      } as IntegrationCreatedEvent);
    }

    return integration;
  }
}

export class ActivateIntegration {
  constructor(
    private readonly repo: IntegrationRepository,
    private readonly eventBus?: EventBus
  ) {}

  async execute(id: IntegrationId): Promise<IntegrationProfile> {
    const integration = await this.repo.findById(id);
    if (!integration) throw new Error('integration not found');
    const updated = new IntegrationProfile({ ...integration, status: 'connected' });
    await this.repo.save(updated);

    if (this.eventBus) {
      await this.eventBus.publish({
        eventType: 'IntegrationActivated',
        integrationId: updated.id,
        occurredAt: new Date()
      } as IntegrationActivatedEvent);
    }

    return updated;
  }
}

export class SuspendIntegration {
  constructor(
    private readonly repo: IntegrationRepository,
    private readonly eventBus?: EventBus
  ) {}

  async execute(id: IntegrationId): Promise<IntegrationProfile> {
    const integration = await this.repo.findById(id);
    if (!integration) throw new Error('integration not found');
    const updated = new IntegrationProfile({ ...integration, status: 'disconnected' });
    await this.repo.save(updated);

    if (this.eventBus) {
      await this.eventBus.publish({
        eventType: 'IntegrationSuspended',
        integrationId: updated.id,
        occurredAt: new Date()
      } as IntegrationSuspendedEvent);
    }

    return updated;
  }
}
