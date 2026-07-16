import { ScreenRepository } from '../../domain/screen/ScreenRepository';

export class GetScreen {
  constructor(private readonly repo: ScreenRepository) {}

  async execute(id: string) {
    const screen = await this.repo.findById(id);
    if (!screen) throw new Error('screen not found');
    return screen;
  }
}

export class ListScreens {
  constructor(private readonly repo: ScreenRepository) {}

  async execute(projectId: string) {
    return this.repo.listByProject(projectId);
  }
}
