import { GenerationRepository } from '../../domain/generation/GenerationJob';
import { CreateGenerationJob, UpdateGenerationStatus, AttachGenerationOutput } from '../command/GenerationCommand';
import { GetGeneration, ListGenerations } from '../query/GenerationQuery';
import { JobStatus } from '../../domain/generation/GenerationJob';

const VALID_JOB_STATUSES = new Set<JobStatus>(['requested', 'completed', 'failed']);

function assertJobStatus(value: string): JobStatus {
  if (!VALID_JOB_STATUSES.has(value as JobStatus)) {
    throw new Error(`invalid job status: ${value}`);
  }
  return value as JobStatus;
}

export class GenerationService {
  constructor(private readonly repo: GenerationRepository) {}

  async create(projectId: string, provider: string, sceneId?: string, promptId?: string, params?: Record<string, string>) {
    return new CreateGenerationJob(this.repo).execute(projectId, provider, sceneId, promptId, params);
  }

  async updateStatus(id: string, status: string) {
    return new UpdateGenerationStatus(this.repo).execute(id, assertJobStatus(status));
  }

  async attachOutput(id: string, outputUri: string) {
    return new AttachGenerationOutput(this.repo).execute(id, outputUri);
  }

  async get(id: string) {
    return new GetGeneration(this.repo).execute(id);
  }

  async listByProject(projectId: string) {
    return new ListGenerations(this.repo).execute(projectId);
  }
}
