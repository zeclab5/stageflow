import type { CueStatus } from './Cue';

export type CueId = string;
export type SceneId = string;

export interface CueProps {
  readonly id: CueId;
  readonly sceneId: SceneId;
  readonly name: string;
  readonly timelinePosition: number;
  readonly status: CueStatus;
}

export interface CueRepository {
  findById(id: CueId): Promise<CueProps | undefined>;
  save(cue: CueProps): Promise<void>;
  delete(id: CueId): Promise<void>;
  listByScene(sceneId: SceneId): Promise<CueProps[]>;
}
