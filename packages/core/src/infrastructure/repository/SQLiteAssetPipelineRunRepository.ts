import { SQLiteConnection } from '../persistence/sqlite/SQLiteConnection';
import {
  AssetPipelineRun,
  AssetPipelineRunRepository,
  AssetPipelineRunId,
  AssetPipelineProjectId,
  AssetPipelineStage,
  AssetPipelineStatus,
  AssetKind,
} from '../../domain/asset/AssetPipeline';

function toKind(raw: string): AssetKind {
  const value = raw.toLowerCase();
  if (value.startsWith('image')) return 'image';
  if (value.startsWith('video')) return 'video';
  if (value.startsWith('audio')) return 'audio';
  if (['pdf', 'document', 'text', 'markdown'].some(prefix => value.startsWith(prefix))) return 'document';
  if (['zip', 'tar', 'gz', '7z'].some(prefix => value.endsWith(prefix))) return 'archive';
  return 'unknown';
}

function toRow(run: AssetPipelineRun) {
  return {
    id: run.id,
    asset_id: run.assetId,
    project_id: run.projectId,
    source_uri: run.sourceUri,
    kind: run.kind,
    status: run.status,
    current_stage: run.currentStage,
    attempts: run.attempts,
    metadata: JSON.stringify(run.metadata),
    thumbnail_uri: run.thumbnailUri,
    cache_uri: run.cacheUri,
    indexed: run.indexed ? 1 : 0,
    error: run.error,
    occurred_at: run.occurredAt.toISOString(),
  };
}

function toDomain(row: Record<string, unknown>): AssetPipelineRun {
  return {
    id: String(row.id),
    assetId: String(row.asset_id),
    projectId: String(row.project_id),
    sourceUri: String(row.source_uri),
    kind: toKind(String(row.kind)),
    status: row.status as AssetPipelineStatus,
    currentStage: row.current_stage as AssetPipelineStage,
    attempts: Number(row.attempts ?? 0),
    metadata: typeof row.metadata === 'string' ? JSON.parse(row.metadata) : (row.metadata ?? {}),
    thumbnailUri: String(row.thumbnail_uri ?? ''),
    cacheUri: String(row.cache_uri ?? ''),
    indexed: Boolean(row.indexed),
    error: String(row.error ?? ''),
    occurredAt: new Date(String(row.occurred_at)),
  };
}

export class SQLiteAssetPipelineRunRepository implements AssetPipelineRunRepository {
  constructor(private readonly db: SQLiteConnection) {}

  async save(run: AssetPipelineRun): Promise<void> {
    const row = toRow(run);
    await this.db.run(
      `INSERT INTO asset_pipeline_runs (id, asset_id, project_id, source_uri, kind, status, current_stage, attempts, metadata, thumbnail_uri, cache_uri, indexed, error, occurred_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         project_id = excluded.project_id,
         status = excluded.status,
         current_stage = excluded.current_stage,
         attempts = excluded.attempts,
         metadata = excluded.metadata,
         thumbnail_uri = excluded.thumbnail_uri,
         cache_uri = excluded.cache_uri,
         indexed = excluded.indexed,
         error = excluded.error,
         occurred_at = excluded.occurred_at`,
      [
        row.id,
        row.asset_id,
        row.project_id,
        row.source_uri,
        row.kind,
        row.status,
        row.current_stage,
        row.attempts,
        row.metadata,
        row.thumbnail_uri,
        row.cache_uri,
        row.indexed ? 1 : 0,
        row.error,
        row.occurred_at,
      ],
    );
  }

  async findById(id: AssetPipelineRunId): Promise<AssetPipelineRun | null> {
    const row = await this.db.get<Record<string, unknown>>('SELECT * FROM asset_pipeline_runs WHERE id = ?', [id]);
    return row ? toDomain(row) : null;
  }

  async listByProject(projectId: AssetPipelineProjectId): Promise<AssetPipelineRun[]> {
    const rows = await this.db.all<Record<string, unknown>>('SELECT * FROM asset_pipeline_runs WHERE project_id = ?', [projectId]);
    return rows.map(toDomain);
  }
}
