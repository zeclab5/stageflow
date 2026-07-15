import { Project } from '../../domain/project/Project';
import { ProjectRepository } from '../../domain/project/ProjectRepository';

export class CloseProject {
  constructor(private readonly repo: ProjectRepository) {}

  async execute(id: string): Promise<Project> {
    const project = await this.repo.findById(id);
    if (!project) {
      throw new Error('project not found');
    }
    if (project.status === 'closed') {
      throw new Error('project is already closed');
    }

    const closed = new Project({
      id: project.id,
      name: project.name,
      status: 'closed'
    });

    await this.repo.save(closed);
    return closed;
  }
}
