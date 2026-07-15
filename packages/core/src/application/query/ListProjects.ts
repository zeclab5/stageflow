import { Project } from '../../domain/project/Project';
import { ProjectFilter, ProjectRepository } from '../../domain/project/ProjectRepository';

export class ListProjects {
  constructor(private readonly repo: ProjectRepository) {}

  async execute(filter?: ProjectFilter): Promise<Project[]> {
    return this.repo.findAll(filter);
  }
}
