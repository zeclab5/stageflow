import { Project } from '../../domain/project/Project';
import { ProjectRepository } from '../../domain/project/ProjectRepository';

export class CreateProject {
  constructor(private readonly repo: ProjectRepository) {}

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
    return project;
  }
}
