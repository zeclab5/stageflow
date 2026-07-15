import { Project, ProjectId } from '../../domain/project/Project';
import { ProjectRepository } from '../../domain/project/ProjectRepository';

export class InMemoryProjectRepository implements ProjectRepository {
  private readonly items = new Map<ProjectId, Project>();

  async findById(id: ProjectId): Promise<Project | null> {
    return this.items.get(id) ?? null;
  }

  async save(project: Project): Promise<void> {
    this.items.set(project.id, project);
  }
}
