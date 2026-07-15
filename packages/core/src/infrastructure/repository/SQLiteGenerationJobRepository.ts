import { SQLiteConnection } from '../persistence/sqlite/SQLiteConnection';
import { GenerationJob, JobId, JobStatus } from '../../domain/generation/GenerationJob';

export class SQLiteGenerationJobRepository {
  constructor(private readonly db: SQLiteConnection) {}

  async findById(id: JobId): Promise<GenerationJob | null> {
    const row = await this.db.get<{ id: string; project_id: string; scene_id?: string; prompt_id?: string; provider: string; params: string; status: string; output?: string }>(
      'SELECT id, project_id, scene_id, prompt_id, provider, params, status, output FROM generations WHERE id = ?',
      [id]
    );
    if (!row) return null;
    return new GenerationJob({
      id: row.id,
      projectId: row.project_id,
      sceneId: row.scene_id,
      promptId: row.prompt_id,
      providerRef: row.provider,
      params: JSON.parse(row.params),
      status: row.status as JobStatus,
      outputUri: row.output
    });
  }

  async save(job: GenerationJob): Promise<void> {
    await this.db.run(
      `INSERT INTO generations (id, project_id, scene_id, prompt_id, provider, params, status, output) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET status = excluded.status, output = excluded.output`,
      [job.id, job.projectId, job.sceneId ?? null, job.promptId ?? null, job.providerRef, JSON.stringify(job.params), job.status, job.outputUri ?? null]
    );
  }
}
