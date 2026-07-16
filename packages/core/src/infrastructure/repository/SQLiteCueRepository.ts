import type { CueId, SceneId, CueProps } from '../../domain/cue/CueRepository';
import { SQLiteConnection } from '../persistence/sqlite/SQLiteConnection';

function toRow(cue: CueProps) {
  return {
    id: cue.id,
    scene_id: cue.sceneId,
    name: cue.name,
    timeline_position: cue.timelinePosition,
    status: cue.status,
  };
}

function toDomain(row: Record<string, unknown>): CueProps {
  return {
    id: String(row.id),
    sceneId: String(row.scene_id),
    name: String(row.name),
    timelinePosition: Number(row.timeline_position),
    status: String(row.status) as CueProps['status'],
  };
}

export class SQLiteCueRepository {
  constructor(private readonly db: SQLiteConnection) {}

  async findById(id: CueId): Promise<CueProps | undefined> {
    const row = await this.db.get<Record<string, unknown>>('SELECT * FROM cues WHERE id = ?', [id]);
    return row ? toDomain(row) : undefined;
  }

  async save(cue: CueProps): Promise<void> {
    const row = toRow(cue);
    await this.db.run(
      `INSERT INTO cues (id, scene_id, name, timeline_position, status) VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET scene_id = excluded.scene_id, name = excluded.name, timeline_position = excluded.timeline_position, status = excluded.status`,
      [row.id, row.scene_id, row.name, row.timeline_position, row.status]
    );
  }

  async delete(id: CueId): Promise<void> {
    await this.db.run('DELETE FROM cues WHERE id = ?', [id]);
  }

  async listByScene(sceneId: SceneId): Promise<CueProps[]> {
    const rows = await this.db.all<Record<string, unknown>>('SELECT * FROM cues WHERE scene_id = ?', [sceneId]);
    return rows.map(toDomain);
  }
}
