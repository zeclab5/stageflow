import { DomainEvent } from '../../infrastructure/event/EventBus';

export interface AssetDetectedEvent extends DomainEvent {
  readonly eventType: 'AssetDetected';
  readonly assetId: string;
  readonly projectId: string;
  readonly sourceUri: string;
  readonly kind: 'image' | 'video' | 'audio' | 'document' | 'archive' | 'unknown';
}

export interface AssetPipelineRunCreatedEvent extends DomainEvent {
  readonly eventType: 'AssetPipelineRunCreated';
  readonly pipelineRunId: string;
  readonly assetId: string;
  readonly projectId: string;
}

export interface AssetPipelineStageCompletedEvent extends DomainEvent {
  readonly eventType: 'AssetPipelineStageCompleted';
  readonly pipelineRunId: string;
  readonly assetId: string;
  readonly stage: string;
  readonly metadata: Record<string, unknown>;
  readonly thumbnailUri: string;
  readonly cacheUri: string;
}

export interface AssetPipelineRunSucceededEvent extends DomainEvent {
  readonly eventType: 'AssetPipelineRunSucceeded';
  readonly pipelineRunId: string;
  readonly assetId: string;
  readonly indexed: boolean;
}

export interface AssetPipelineRunFailedEvent extends DomainEvent {
  readonly eventType: 'AssetPipelineRunFailed';
  readonly pipelineRunId: string;
  readonly assetId: string;
  readonly error: string;
}

export type AssetPipelineEvent =
  | AssetDetectedEvent
  | AssetPipelineRunCreatedEvent
  | AssetPipelineStageCompletedEvent
  | AssetPipelineRunSucceededEvent
  | AssetPipelineRunFailedEvent;
