import { Project } from '../../domain/project/Project';
import { ProjectRepository } from '../../domain/project/ProjectRepository';

export class UpdateProject {
  constructor(private readonly repo: ProjectRepository) {}

  async execute(id: string, patch: { name?: string }): Promise<Project> {
    const project = await this.repo.findById(id);
    if (!project) {
      throw new Error('project not found');
    }
    if (project.status === 'closed') {
      throw new Error('closed project cannot be updated');
    }

    const updated = new Project({
      id: project.id,
      name: patch.name ?? project.name,
      status: project.status
    });

    await this.repo.save(updated);
    return updated;
  }
}
