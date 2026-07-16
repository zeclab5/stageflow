import { SQLiteConnection } from '../persistence/sqlite/SQLiteConnection';
import { Asset, AssetId, AssetType } from '../../domain/asset/Asset';

function toRow(asset: Asset) {
  return {
    id: asset.id,
    project_id: asset.projectId,
    name: asset.name,
    type: asset.type,
    uri: asset.uri,
    description: asset.description ?? '',
    tags: JSON.stringify(asset.tags ?? []),
    size: asset.size ?? 0
  };
}

function toDomain(row: Record<string, unknown>): Asset {
  const tags = typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags;
  return new Asset({
    id: String(row.id),
    projectId: String(row.project_id),
    name: String(row.name),
    type: String(row.type) as AssetType,
    uri: String(row.uri),
    description: row.description ? String(row.description) : undefined,
    tags: Array.isArray(tags) ? tags.map(String) : undefined,
    size: Number(row.size) || undefined
  });
}

export class SQLiteAssetRepository {
  constructor(private readonly db: SQLiteConnection) {}

  async findById(id: AssetId): Promise<Asset | null> {
    const row = await this.db.get<Record<string, unknown>>('SELECT * FROM assets WHERE id = ?', [id]);
    return row ? toDomain(row) : null;
  }

  async save(asset: Asset): Promise<void> {
    const row = toRow(asset);
    await this.db.run(
      `INSERT INTO assets (id, project_id, name, type, uri, description, tags, size) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET name = excluded.name, type = excluded.type, uri = excluded.uri, description = excluded.description, tags = excluded.tags, size = excluded.size`,
      [row.id, row.project_id, row.name, row.type, row.uri, row.description, JSON.stringify(row.tags), row.size]
    );
  }

  async delete(id: AssetId): Promise<void> {
    await this.db.run('DELETE FROM assets WHERE id = ?', [id]);
  }

  async listByProject(projectId: string): Promise<Asset[]> {
    const rows = await this.db.all<Record<string, unknown>>('SELECT * FROM assets WHERE project_id = ?', [projectId]);
    return rows.map(toDomain);
  }
}
