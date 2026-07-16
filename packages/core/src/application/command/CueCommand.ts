import { CueRepository } from '../../domain/cue/CueRepository';

export class CreateCue {
  constructor(private readonly repo: CueRepository) {}
  async execute(sceneId: string, name: string, timelinePosition: number) {
    const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    const cue = { id, sceneId, name, timelinePosition, status: 'pending' as const };
    await this.repo.save(cue);
    return cue;
  }
}

export class RenameCue {
  constructor(private readonly repo: CueRepository) {}
  async execute(id: string, name: string) {
    const cue = await this.repo.findById(id);
    if (!cue) throw new Error('CUE_NOT_FOUND');
    const next = { ...cue, name };
    await this.repo.save(next);
    return next;
  }
}

export class ReorderCue {
  constructor(private readonly repo: CueRepository) {}
  async execute(id: string, timelinePosition: number) {
    const cue = await this.repo.findById(id);
    if (!cue) throw new Error('CUE_NOT_FOUND');
    const next = { ...cue, timelinePosition };
    await this.repo.save(next);
    return next;
  }
}

export class RemoveCue {
  constructor(private readonly repo: CueRepository) {}
  async execute(id: string) {
    await this.repo.delete(id);
    return { id };
  }
}
