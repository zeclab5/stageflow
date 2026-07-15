import { Project, ProjectId, ProjectStatus } from './Project';

export interface ProjectFilter {
  status?: ProjectStatus;
  nameContains?: string;
}

export interface ProjectRepository {
  findById(id: ProjectId): Promise<Project | null>;
  findAll(filter?: ProjectFilter): Promise<Project[]>;
  save(project: Project): Promise<void>;
}
