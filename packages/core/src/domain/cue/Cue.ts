import type { SceneId } from '../scene/Scene';

export type CueId = string;
export type CueStatus = 'pending' | 'triggered' | 'done' | 'failed';

export interface CueProps {
  readonly id: CueId;
  readonly sceneId: SceneId;
  readonly name: string;
  readonly timelinePosition: number;
  readonly status: CueStatus;
}

export class Cue {
  constructor(private readonly props: CueProps) {}

  get id() { return this.props.id; }
  get sceneId() { return this.props.sceneId; }
  get name() { return this.props.name; }
  get timelinePosition() { return this.props.timelinePosition; }
  get status() { return this.props.status; }
}
