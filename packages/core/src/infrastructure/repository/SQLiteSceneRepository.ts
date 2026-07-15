import { SQLiteConnection } from '../persistence/sqlite/SQLiteConnection';
import { Scene, SceneId } from '../../domain/scene/SceneRepository';

export class SQLiteSceneRepository {
  constructor(private readonly db: SQLiteConnection) {}

  async findById(id: SceneId): Promise<Scene | null> {
    const row = await this.db.get<{ id: string; projectId: string; name: string; sceneOrder: number }>(
      'SELECT id, project_id as projectId, name, "order" as sceneOrder FROM scenes WHERE id = ?',
      [id]
    );
    if (!row) return null;
    return new Scene({ id: row.id, projectId: row.projectId, name: row.name, order: row.sceneOrder });
  }

  async save(scene: Scene): Promise<void> {
    await this.db.run(
      `INSERT INTO scenes (id, project_id, name, "order") VALUES (?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET name = excluded.name, "order" = excluded."order"`,
      [scene.id, scene.projectId, scene.name, scene.order]
    );
  }
}
