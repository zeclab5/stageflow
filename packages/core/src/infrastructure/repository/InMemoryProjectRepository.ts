import { Project, ProjectId } from '../../domain/project/Project';
import { ProjectFilter, ProjectRepository } from '../../domain/project/ProjectRepository';

export class InMemoryProjectRepository implements ProjectRepository {
  private readonly items = new Map<ProjectId, Project>();

  async findById(id: ProjectId): Promise<Project | null> {
    return this.items.get(id) ?? null;
  }

  async findAll(filter?: ProjectFilter): Promise<Project[]> {
    let projects = [...this.items.values()];
    if (filter?.status) {
      projects = projects.filter(p => p.status === filter.status);
    }
    if (filter?.nameContains) {
      const needle = filter.nameContains.toLowerCase();
      projects = projects.filter(p => p.name.toLowerCase().includes(needle));
    }
    return projects;
  }

  async save(project: Project): Promise<void> {
    this.items.set(project.id, project);
  }
}
