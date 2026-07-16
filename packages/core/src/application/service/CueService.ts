import { CueRepository } from '../../domain/cue/CueRepository';
import { CreateCue, RenameCue, ReorderCue, RemoveCue } from '../command/CueCommand';
import { ListCues, GetCue } from '../query/CueQuery';

export class CueService {
  constructor(private readonly repo: CueRepository) {}

  async create(sceneId: string, name: string, timelinePosition: number) {
    return new CreateCue(this.repo).execute(sceneId, name, timelinePosition);
  }

  async rename(id: string, name: string) {
    return new RenameCue(this.repo).execute(id, name);
  }

  async reorder(id: string, order: number) {
    return new ReorderCue(this.repo).execute(id, order);
  }

  async remove(id: string) {
    return new RemoveCue(this.repo).execute(id);
  }

  async listByScene(sceneId: string) {
    return new ListCues(this.repo).execute(sceneId);
  }

  async get(id: string) {
    return new GetCue(this.repo).execute(id);
  }
}
