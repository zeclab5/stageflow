import { ScreenRepository } from '../../domain/screen/ScreenRepository';
import { EventBus } from '../../infrastructure/event/EventBus';
import { ScreenCreatedEvent, ScreenRenamedEvent, ScreenReorderedEvent } from '../../domain/screen/ScreenEvent';
import type { ScreenProps } from '../../domain/screen/ScreenRepository';

export class CreateScreen {
  constructor(
    private readonly repo: ScreenRepository,
    private readonly eventBus?: EventBus
  ) {}

  async execute(projectId: string, name: string, type: string, resolution: { width: number; height: number }, description?: string, enabled = true, order: number = 0) {
    const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    const screen: ScreenProps = { id, projectId, name, type: type as ScreenProps['type'], resolution, description, enabled, order };
    await this.repo.save(screen);
    if (this.eventBus) {
      await this.eventBus.publish({ eventType: 'ScreenCreated', screenId: id, projectId, name, occurredAt: new Date() } as ScreenCreatedEvent);
    }
    return screen;
  }
}

export class RenameScreen {
  constructor(
    private readonly repo: ScreenRepository,
    private readonly eventBus?: EventBus
  ) {}

  async execute(id: string, name: string, description?: string, type?: string, resolution?: { width: number; height: number }, enabled?: boolean, order = 0) {
    const screen = await this.repo.findById(id);
    if (!screen) throw new Error('screen not found');
    const next: ScreenProps = { ...screen, name, description, type: type as ScreenProps['type'], resolution: resolution ?? screen.resolution, enabled: enabled ?? screen.enabled, order };
    await this.repo.save(next);
    if (this.eventBus) {
      await this.eventBus.publish({ eventType: 'ScreenRenamed', screenId: id, name, occurredAt: new Date() } as ScreenRenamedEvent);
    }
    return next;
  }
}

export class ReorderScreen {
  constructor(
    private readonly repo: ScreenRepository,
    private readonly eventBus?: EventBus
  ) {}

  async execute(id: string, order: number) {
    const screen = await this.repo.findById(id);
    if (!screen) throw new Error('screen not found');
    const next: ScreenProps = { ...screen, order };
    await this.repo.save(next);
    if (this.eventBus) {
      await this.eventBus.publish({ eventType: 'ScreenReordered', screenId: id, order, occurredAt: new Date() } as ScreenReorderedEvent);
    }
    return next;
  }
}

export class DeleteScreen {
  constructor(private readonly repo: ScreenRepository) {}

  async execute(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
