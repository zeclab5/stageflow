export interface JobRequestedEvent {
  readonly eventType: 'JobRequested';
  readonly jobId: string;
  readonly projectId: string;
  readonly providerRef: string;
  readonly occurredAt: Date;
}

export interface JobCompletedEvent {
  readonly eventType: 'JobCompleted';
  readonly jobId: string;
  readonly outputUri: string;
  readonly occurredAt: Date;
}

export interface JobFailedEvent {
  readonly eventType: 'JobFailed';
  readonly jobId: string;
  readonly occurredAt: Date;
}

export type GenerationEvent = JobRequestedEvent | JobCompletedEvent | JobFailedEvent;
