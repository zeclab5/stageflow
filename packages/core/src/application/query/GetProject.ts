import { ProjectRepository } from '../../domain/project/ProjectRepository';

export class GetProject {
  constructor(private readonly repo: ProjectRepository) {}

  async execute(id: string) {
    const project = await this.repo.findById(id);
    if (!project) {
      throw new Error('project not found');
    }
    return project;
  }
}
