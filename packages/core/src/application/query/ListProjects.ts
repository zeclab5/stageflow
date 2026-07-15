import { Project } from '../../domain/project/Project';
import { ProjectRepository } from '../../domain/project/ProjectRepository';

export class ListProjects {
  constructor(private readonly repo: ProjectRepository) {}

  async execute(): Promise<Project[]> {
    return [];
  }
}
