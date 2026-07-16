import { SQLiteConnection } from '../persistence/sqlite/SQLiteConnection';
import { Asset, AssetType } from '../../domain/asset/Asset';

function toRow(asset: Asset) {
  return {
    id: asset.id,
    project_id: asset.projectId,
    name: asset.name,
    type: asset.type,
    uri: asset.uri,
    description: asset.description ?? '',
    tags: JSON.stringify(asset.tags ?? []),
    size: asset.size ?? 0,
    metadata: JSON.stringify(JSON.parse(JSON.stringify(asset))),
    status: 'active'
  } as Record<string, unknown>;
}

function toDomain(row: Record<string, unknown>): Asset {
  const asset = new Asset({
    id: String(row.id),
    projectId: String(row.project_id),
    name: String(row.name ?? ''),
    type: String(row.type) as AssetType,
    uri: String(row.uri),
    description: row.description !== undefined ? String(row.description) : '',
    tags: Array.isArray(row.tags) ? (row.tags as Asset['tags']) : typeof row.tags === 'string' ? JSON.parse(row.tags) : [],
    size: Number(row.size ?? 0)
  });
  return asset;
}

export class SQLiteAssetRepository {
  constructor(private readonly db: SQLiteConnection) {}

  async findById(id: string): Promise<Asset | null> {
    const row = await this.db.get<Record<string, unknown>>('SELECT * FROM assets WHERE id = ?', [id]);
    const domain = row ? toDomain(row) : null;
    return domain;
  }

  async listByProject(projectId: string): Promise<Asset[]> {
    const rows = await this.db.all<Record<string, unknown>>('SELECT * FROM assets WHERE project_id = ?', [projectId]);
    return rows.map((row) => toDomain(row)).filter((item): item is Asset => item !== undefined);
  }

  async save(asset: Asset): Promise<void> {
    const row = toRow(asset);
    await this.db.run(
      `INSERT INTO assets (id, project_id, name, type, uri, description, tags, size, metadata, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET project_id = excluded.project_id, name = excluded.name, type = excluded.type, uri = excluded.uri, description = excluded.description, tags = excluded.tags, size = excluded.size, metadata = excluded.metadata`,
      [row.id, row.project_id, row.name, row.type, row.uri, row.description, row.tags, row.size, row.metadata, row.status]
    );
  }

  async delete(id: string) {
    await this.db.run('DELETE FROM assets WHERE id = ?', [id]);
  }
}
