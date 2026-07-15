import { Project, ProjectId } from './Project';
export interface ProjectRepository { findById(id: ProjectId): Promise<Project | null>; save(project: Project): Promise<void>; }
