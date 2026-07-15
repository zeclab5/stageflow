import { ProjectRepository } from '../../domain/project/ProjectRepository';
import { CreateProject } from '../command/CreateProject';
import { CloseProject } from '../command/CloseProject';
import { UpdateProject } from '../command/UpdateProject';
import { GetProject } from '../query/GetProject';
import { ListProjects } from '../query/ListProjects';

export class ProjectService {
  constructor(private readonly repo: ProjectRepository) {}

  async create(name: string) {
    return new CreateProject(this.repo).execute(name);
  }

  async update(id: string, name?: string) {
    return new UpdateProject(this.repo).execute(id, { name });
  }

  async close(id: string) {
    return new CloseProject(this.repo).execute(id);
  }

  async get(id: string) {
    return new GetProject(this.repo).execute(id);
  }

  async list() {
    return new ListProjects(this.repo).execute();
  }
}
