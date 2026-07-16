import type { CueId, SceneId, CueProps } from '../../domain/cue/CueRepository';
import { SQLiteConnection } from '../persistence/sqlite/SQLiteConnection';

export class SQLiteCueRepository {
  constructor(private readonly db: SQLiteConnection) {}

  async findById(id: CueId): Promise<CueProps | undefined> {
    const row = await this.db.get<CueProps>('SELECT * FROM cues WHERE id = ?', [id]);
    return row ?? undefined;
  }

  async save(cue: CueProps): Promise<void> {
    await this.db.run(
      `INSERT INTO cues (id, scene_id, name, timeline_position, status) VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET name = excluded.name, timeline_position = excluded.timeline_position, status = excluded.status`,
      [cue.id, cue.sceneId, cue.name, cue.timelinePosition, cue.status]
    );
  }

  async delete(id: CueId): Promise<void> {
    await this.db.run('DELETE FROM cues WHERE id = ?', [id]);
  }

  async listByScene(sceneId: SceneId): Promise<CueProps[]> {
    const rows: CueProps[] = await this.db.all('SELECT * FROM cues WHERE scene_id = ?', [sceneId]);
    return rows ?? [];
  }
}
