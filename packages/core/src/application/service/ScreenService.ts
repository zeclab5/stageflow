import { ScreenRepository } from '../../domain/screen/ScreenRepository';
import { CreateScreen, RenameScreen, ReorderScreen, DeleteScreen } from '../command/ScreenCommand';
import { GetScreen, ListScreens } from '../query/ScreenQuery';

export class ScreenService {
  constructor(private readonly repo: ScreenRepository) {}

  async create(projectId: string, name: string, type: string, resolution: { width: number; height: number }, description?: string, enabled = true, order = 0) {
    return new CreateScreen(this.repo).execute(projectId, name, type, resolution, description, enabled, order);
  }

  async rename(id: string, name: string, description?: string, type?: string, resolution?: { width: number; height: number }, enabled?: boolean, order = 0) {
    return new RenameScreen(this.repo).execute(id, name, description, type, resolution, enabled, order);
  }

  async reorder(id: string, order: number) {
    return new ReorderScreen(this.repo).execute(id, order);
  }

  async remove(id: string) {
    return new DeleteScreen(this.repo).execute(id);
  }

  async listByProject(projectId: string) {
    return new ListScreens(this.repo).execute(projectId);
  }

  async get(id: string) {
    return new GetScreen(this.repo).execute(id);
  }
}
