import type { CueRepository } from '../../domain/cue/CueRepository';

export class ListCues {
  constructor(private readonly repo: CueRepository) {}
  async execute(sceneId: string) {
    return this.repo.listByScene(sceneId);
  }
}

export class GetCue {
  constructor(private readonly repo: CueRepository) {}
  async execute(id: string) {
    const cue = await this.repo.findById(id);
    if (!cue) throw new Error('CUE_NOT_FOUND');
    return cue;
  }
}
