import { Project } from '../../domain/project/Project';
import { ProjectRepository } from '../../domain/project/ProjectRepository';
import { EventBus } from '../../infrastructure/event/EventBus';
import { ProjectCreatedEvent } from '../../domain/project/ProjectEvent';

export class CreateProject {
  constructor(
    private readonly repo: ProjectRepository,
    private readonly eventBus?: EventBus
  ) {}

  async execute(name: string): Promise<Project> {
    if (!name || !name.trim()) {
      throw new Error('project name is required');
    }

    const project = new Project({
      id: crypto.randomUUID(),
      name: name.trim(),
      status: 'draft'
    });

    await this.repo.save(project);

    if (this.eventBus) {
      const event: ProjectCreatedEvent = {
        eventType: 'ProjectCreated',
        projectId: project.id,
        name: project.name,
        occurredAt: new Date()
      };
      await this.eventBus.publish(event);
    }

    return project;
  }
}
