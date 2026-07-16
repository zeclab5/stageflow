import { SQLiteConnection } from '../persistence/sqlite/SQLiteConnection';
import type { ScreenProps, ProjectId, ScreenId } from '../../domain/screen/ScreenRepository';

function toRow(screen: ScreenProps) {
  return {
    id: screen.id,
    project_id: screen.projectId,
    name: screen.name,
    type: screen.type,
    resolution: JSON.stringify(screen.resolution),
    resolution_width: screen.resolution.width,
    resolution_height: screen.resolution.height,
    description: screen.description ?? '',
    enabled: screen.enabled ? 1 : 0,
    order: screen.order
  };
}

function toDomain(row: Record<string, unknown>): ScreenProps {
  const resolution = typeof row.resolution === 'string' ? JSON.parse(row.resolution) : row.resolution;
  return {
    id: String(row.id),
    projectId: String(row.project_id),
    name: String(row.name),
    type: String(row.type) as ScreenProps['type'],
    resolution: { width: Number(resolution?.width ?? row.resolution_width), height: Number(resolution?.height ?? row.resolution_height) },
    description: row.description ? String(row.description) : undefined,
    enabled: Number(row.enabled) === 1,
    order: Number(row.order)
  };
}

export class SQLiteScreenRepository {
  constructor(private readonly db: SQLiteConnection) {}

  async findById(id: ScreenId): Promise<ScreenProps | null> {
    const row = await this.db.get<Record<string, unknown>>('SELECT * FROM screens WHERE id = ?', [id]);
    return row ? toDomain(row) : null;
  }

  async save(screen: ScreenProps): Promise<void> {
    const row = toRow(screen);
    await this.db.run(
      `INSERT INTO screens (id, project_id, name, type, resolution, resolution_width, resolution_height, description, enabled, "order") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET name = excluded.name, type = excluded.type, resolution = excluded.resolution, description = excluded.description, enabled = excluded.enabled, "order" = excluded."order"`,
      [row.id, row.project_id, row.name, row.type, row.resolution, row.resolution_width, row.resolution_height, row.description, row.enabled, row.order]
    );
  }

  async delete(id: ScreenId): Promise<void> {
    await this.db.run('DELETE FROM screens WHERE id = ?', [id]);
  }

  async listByProject(projectId: ProjectId): Promise<ScreenProps[]> {
    const rows = await this.db.all<Record<string, unknown>>('SELECT * FROM screens WHERE project_id = ?', [projectId]);
    return rows.map(toDomain);
  }
}
