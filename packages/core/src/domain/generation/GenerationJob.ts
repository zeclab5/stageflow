export type JobId = string;
export type ProjectId = string;
export type SceneId = string;
export type PromptId = string;
export type JobStatus = 'requested' | 'completed' | 'failed';

export interface GenerationJobProps {
  readonly id: JobId;
  readonly projectId: ProjectId;
  readonly sceneId?: SceneId;
  readonly promptId?: PromptId;
  readonly providerRef: string;
  readonly params: Record<string, string>;
  readonly status: JobStatus;
  readonly outputUri?: string;
}

export class GenerationJob {
  readonly id: JobId;
  readonly projectId: ProjectId;
  readonly sceneId?: SceneId;
  readonly promptId?: PromptId;
  readonly providerRef: string;
  readonly params: Record<string, string>;
  readonly status: JobStatus;
  readonly outputUri?: string;

  constructor(props: GenerationJobProps) {
    this.id = props.id;
    this.projectId = props.projectId;
    this.sceneId = props.sceneId;
    this.promptId = props.promptId;
    this.providerRef = props.providerRef;
    this.params = props.params;
    this.status = props.status;
    this.outputUri = props.outputUri;
  }
}

export interface GenerationRepository {
  findById(id: JobId): Promise<GenerationJob | null>;
  save(job: GenerationJob): Promise<void>;
}
