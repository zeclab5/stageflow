import { GenerationJob, GenerationRepository, JobId } from '../../domain/generation/GenerationJob';

export class GetGeneration {
  constructor(private readonly repo: GenerationRepository) {}

  async execute(id: JobId) {
    const job = await this.repo.findById(id);
    if (!job) throw new Error('generation job not found');
    return job;
  }
}

export class ListGenerations {
  constructor(private readonly repo: GenerationRepository) {}

  async execute(projectId?: string): Promise<GenerationJob[]> {
    void projectId;
    return [];
  }
}
