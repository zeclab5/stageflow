export type AssetPipelineAssetId = string;
export type AssetPipelineProjectId = string;
export type AssetPipelineRunId = string;
export type AssetPipelineStage =
  | 'detect'
  | 'metadata'
  | 'thumbnail'
  | 'library'
  | 'cache'
  | 'index'
  | 'completed'
  | 'failed';
export type AssetPipelineStatus = 'queued' | 'running' | 'succeeded' | 'failed';
export type AssetKind = 'image' | 'video' | 'audio' | 'document' | 'archive' | 'unknown';

export interface AssetPipelineRun {
  readonly id: AssetPipelineRunId;
  readonly assetId: AssetPipelineAssetId;
  readonly projectId: AssetPipelineProjectId;
  readonly sourceUri: string;
  readonly kind: AssetKind;
  readonly status: AssetPipelineStatus;
  readonly currentStage: AssetPipelineStage;
  readonly attempts: number;
  readonly metadata: Record<string, unknown>;
  readonly thumbnailUri: string;
  readonly cacheUri: string;
  readonly indexed: boolean;
  readonly error: string;
  readonly occurredAt: Date;
}

export interface AssetPipelineRunRepository {
  save(run: AssetPipelineRun): Promise<void>;
  findById(id: string): Promise<AssetPipelineRun | null>;
  listByProject(projectId: string): Promise<AssetPipelineRun[]>;
}

export interface AssetPipelineStep {
  readonly name: AssetPipelineStage;
  execute(input: PipelineStepInput): Promise<PipelineStepOutput>;
}

export interface PipelineStepInput {
  readonly run: AssetPipelineRun;
  readonly assetPath: string;
}

export interface PipelineStepOutput {
  readonly nextStage: AssetPipelineStage;
  readonly metadata: Record<string, unknown>;
  readonly thumbnailUri: string;
  readonly cacheUri: string;
  readonly error: string;
}

export interface AssetPipelineEngine {
  submit(input: { projectId: string; assetPath: string }): Promise<AssetPipelineRun>;
  runOnce(): Promise<AssetPipelineRun | null>;
  runAll(): Promise<AssetPipelineRun[]>;
}
