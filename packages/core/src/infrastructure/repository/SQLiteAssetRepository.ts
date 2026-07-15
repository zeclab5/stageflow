import { SQLiteConnection } from '../persistence/sqlite/SQLiteConnection';
import { Asset, AssetId, AssetType } from '../../domain/asset/Asset';

export class SQLiteAssetRepository {
  constructor(private readonly db: SQLiteConnection) {}

  async findById(id: AssetId): Promise<Asset | null> {
    const row = await this.db.get<{ id: string; projectId: string; type: string; uri: string }>(
      'SELECT id, project_id as projectId, type, uri FROM assets WHERE id = ?',
      [id]
    );
    if (!row) return null;
    return new Asset({ id: row.id, projectId: row.projectId, type: row.type as AssetType, uri: row.uri });
  }

  async save(asset: Asset): Promise<void> {
    await this.db.run(
      `INSERT INTO assets (id, project_id, type, uri) VALUES (?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET type = excluded.type, uri = excluded.uri`,
      [asset.id, asset.projectId, asset.type, asset.uri]
    );
  }
}
