import { GenerationJob, JobId, JobStatus, GenerationRepository, ProjectId, SceneId, PromptId } from '../../domain/generation/GenerationJob';
import { EventBus } from '../../infrastructure/event/EventBus';
import { JobRequestedEvent, JobCompletedEvent } from '../../domain/generation/GenerationEvent';

export class CreateGenerationJob {
  constructor(
    private readonly repo: GenerationRepository,
    private readonly eventBus?: EventBus
  ) {}

  async execute(projectId: ProjectId, providerRef: string, sceneId?: SceneId, promptId?: PromptId, params?: Record<string, string>): Promise<GenerationJob> {
    const job = new GenerationJob({
      id: crypto.randomUUID(),
      projectId,
      sceneId,
      promptId,
      providerRef,
      params: params ?? {},
      status: 'requested'
    });
    await this.repo.save(job);

    if (this.eventBus) {
      await this.eventBus.publish({
        eventType: 'JobRequested',
        jobId: job.id,
        projectId: job.projectId,
        providerRef: job.providerRef,
        occurredAt: new Date()
      } as JobRequestedEvent);
    }

    return job;
  }
}

export class UpdateGenerationStatus {
  constructor(private readonly repo: GenerationRepository) {}

  async execute(id: JobId, status: JobStatus): Promise<GenerationJob> {
    const job = await this.repo.findById(id);
    if (!job) throw new Error('generation job not found');
    if (job.status === 'completed') throw new Error('completed job cannot be updated');
    const updated = new GenerationJob({ ...job, status });
    await this.repo.save(updated);
    return updated;
  }
}

export class AttachGenerationOutput {
  constructor(
    private readonly repo: GenerationRepository,
    private readonly eventBus?: EventBus
  ) {}

  async execute(id: JobId, outputUri: string): Promise<GenerationJob> {
    const job = await this.repo.findById(id);
    if (!job) throw new Error('generation job not found');
    if (job.status === 'completed') throw new Error('completed job cannot be updated');
    const updated = new GenerationJob({ ...job, status: 'completed', outputUri });
    await this.repo.save(updated);

    if (this.eventBus) {
      await this.eventBus.publish({
        eventType: 'JobCompleted',
        jobId: updated.id,
        outputUri: updated.outputUri ?? outputUri,
        occurredAt: new Date()
      } as JobCompletedEvent);
    }

    return updated;
  }
}
