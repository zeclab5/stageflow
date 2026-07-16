import { Scene, SceneId, SceneRepository } from '../../domain/scene/SceneRepository';
import { EventBus } from '../../infrastructure/event/EventBus';
import { SceneCreatedEvent, SceneRenamedEvent, SceneReorderedEvent } from '../../domain/scene/SceneEvent';

export class CreateScene {
  constructor(
    private readonly repo: SceneRepository,
    private readonly eventBus?: EventBus
  ) {}

  async execute(projectId: string, name: string, order: number, active: boolean = false): Promise<Scene> {
    if (!name || !name.trim()) throw new Error('scene name is required');
    if (!Number.isInteger(order) || order < 1) throw new Error('scene order must be >= 1');

    const scene = new Scene({
      id: crypto.randomUUID(),
      projectId,
      name: name.trim(),
      order,
      active
    });

    await this.repo.save(scene);

    if (this.eventBus) {
      await this.eventBus.publish({
        eventType: 'SceneCreated',
        sceneId: scene.id,
        projectId: scene.projectId,
        name: scene.name,
        occurredAt: new Date()
      } as SceneCreatedEvent);
    }

    return scene;
  }
}

export class RenameScene {
  constructor(
    private readonly repo: SceneRepository,
    private readonly eventBus?: EventBus
  ) {}

  async execute(id: SceneId, name: string): Promise<Scene> {
    const scene = await this.repo.findById(id);
    if (!scene) throw new Error('scene not found');
    if (!name || !name.trim()) throw new Error('scene name is required');

    const updated = new Scene({
      id: scene.id,
      projectId: scene.projectId,
      name: name.trim(),
      order: scene.order,
      active: scene.active
    });

    await this.repo.save(updated);

    if (this.eventBus) {
      await this.eventBus.publish({
        eventType: 'SceneRenamed',
        sceneId: updated.id,
        name: updated.name,
        occurredAt: new Date()
      } as SceneRenamedEvent);
    }

    return updated;
  }
}

export class ActivateScene {
  constructor(
    private readonly repo: SceneRepository,
    private readonly projectId: string
  ) {}

  async execute(id: SceneId): Promise<void> {
    const scenes = await this.repo.listByProject(this.projectId);
    for (const scene of scenes) {
      await this.repo.save(new Scene({ ...scene, active: scene.id === id }));
    }
  }
}

export class ReorderScene {
  constructor(
    private readonly repo: SceneRepository,
    private readonly eventBus?: EventBus
  ) {}

  async execute(id: SceneId, order: number): Promise<Scene> {
    const scene = await this.repo.findById(id);
    if (!scene) throw new Error('scene not found');
    if (!Number.isInteger(order) || order < 1) throw new Error('scene order must be >= 1');

    const updated = new Scene({
      id: scene.id,
      projectId: scene.projectId,
      name: scene.name,
      order,
      active: scene.active
    });

    await this.repo.save(updated);

    if (this.eventBus) {
      await this.eventBus.publish({
        eventType: 'SceneReordered',
        sceneId: updated.id,
        order: updated.order,
        occurredAt: new Date()
      } as SceneReorderedEvent);
    }

    return updated;
  }
}

export class DeleteScene {
  constructor(
    private readonly repo: SceneRepository,
    private readonly eventBus?: EventBus
  ) {}

  async execute(id: SceneId): Promise<void> {
    await this.repo.delete(id);
  }
}
