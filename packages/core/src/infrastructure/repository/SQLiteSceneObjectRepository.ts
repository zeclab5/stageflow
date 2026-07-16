import { SQLiteConnection } from '../persistence/sqlite/SQLiteConnection';
import type { SceneObjectProps } from '../../domain/scene/SceneObject';
import { SceneObjectRepository } from '../../domain/scene/SceneObjectRepository';

function toRow(object: SceneObjectProps) {
  return {
    id: object.id,
    scene_id: object.sceneId,
    asset_id: object.assetId,
    x: object.x,
    y: object.y,
    width: object.width,
    height: object.height,
    rotation: object.rotation,
    opacity: object.opacity,
    visible: object.visible ? 1 : 0,
    layer_index: object.layerIndex
  };
}

function toDomain(row: Record<string, unknown>): SceneObjectProps {
  return {
    id: String(row.id),
    sceneId: String(row.scene_id),
    assetId: String(row.asset_id),
    x: Number(row.x),
    y: Number(row.y),
    width: Number(row.width),
    height: Number(row.height),
    rotation: Number(row.rotation),
    opacity: Number(row.opacity),
    visible: Number(row.visible) === 1,
    layerIndex: Number(row.layer_index)
  };
}

export class SQLiteSceneObjectRepository implements SceneObjectRepository {
  constructor(private readonly db: SQLiteConnection) {}

  async findById(id: string): Promise<SceneObjectProps | undefined> {
    const row = await this.db.get<Record<string, unknown>>('SELECT * FROM scene_objects WHERE id = ?', [id]);
    return row ? toDomain(row) : undefined;
  }

  async listByScene(sceneId: string): Promise<SceneObjectProps[]> {
    const rows = await this.db.all<Record<string, unknown>>('SELECT * FROM scene_objects WHERE scene_id = ?', [sceneId]);
    return rows.map(toDomain);
  }

  async save(object: SceneObjectProps): Promise<void> {
    const row = toRow(object);
    await this.db.run(
      `INSERT INTO scene_objects (id, scene_id, asset_id, x, y, width, height, rotation, opacity, visible, layer_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET scene_id = excluded.scene_id, asset_id = excluded.asset_id, x = excluded.x, y = excluded.y, width = excluded.width, height = excluded.height, rotation = excluded.rotation, opacity = excluded.opacity, visible = excluded.visible, layer_index = excluded.layer_index`,
      [row.id, row.scene_id, row.asset_id, row.x, row.y, row.width, row.height, row.rotation, row.opacity, row.visible, row.layer_index]
    );
  }

  async delete(id: string): Promise<void> {
    await this.db.run('DELETE FROM scene_objects WHERE id = ?', [id]);
  }
}
