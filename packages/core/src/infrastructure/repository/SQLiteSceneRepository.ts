import { SQLiteConnection } from '../persistence/sqlite/SQLiteConnection';
import { Scene, SceneId } from '../../domain/scene/SceneRepository';

export class SQLiteSceneRepository {
  constructor(private readonly db: SQLiteConnection) {}

  async findById(id: SceneId): Promise<Scene | null> {
    const row = await this.db.get<{ id: string; projectId: string; name: string; sceneOrder: number; active?: number }>(
      'SELECT id, project_id as projectId, name, "order" as sceneOrder, active FROM scenes WHERE id = ?',
      [id]
    );
    if (!row) return null;
    return new Scene({ id: row.id, projectId: row.projectId, name: row.name, order: row.sceneOrder, active: Number(row.active ?? 0) === 1 });
  }

  async save(scene: Scene): Promise<void> {
    await this.db.run(
      `INSERT INTO scenes (id, project_id, name, "order", active) VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET name = excluded.name, "order" = excluded."order", active = excluded.active`,
      [scene.id, scene.projectId, scene.name, scene.order, scene.active ? 1 : 0]
    );
  }

  async delete(id: SceneId): Promise<void> {
    await this.db.run('DELETE FROM scenes WHERE id = ?', [id]);
  }

  async listByProject(projectId: string): Promise<Scene[]> {
    const rows = await this.db.all<{ id: string; projectId: string; name: string; sceneOrder: number; active?: number }>(
      'SELECT id, project_id as projectId, name, "order" as sceneOrder, active FROM scenes WHERE project_id = ? ORDER BY "order" ASC',
      [projectId]
    );
    return rows.map((row) => new Scene({ id: row.id, projectId: row.projectId, name: row.name, order: row.sceneOrder, active: Number(row.active ?? 0) === 1 }));
  }
}
