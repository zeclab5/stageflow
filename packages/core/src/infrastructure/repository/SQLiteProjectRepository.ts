import { SQLiteConnection } from '../persistence/sqlite/SQLiteConnection';
import { Project, ProjectId, ProjectStatus } from '../../domain/project/Project';
import { ProjectFilter, ProjectRepository } from '../../domain/project/ProjectRepository';

export class SQLiteProjectRepository implements ProjectRepository {
  constructor(private readonly db: SQLiteConnection) {}

  async findById(id: ProjectId): Promise<Project | null> {
    const row = await this.db.get<{ id: string; name: string; status: string }>(
      'SELECT id, name, status FROM projects WHERE id = ?',
      [id]
    );
    if (!row) return null;
    return new Project({ id: row.id, name: row.name, status: row.status as ProjectStatus });
  }

  async findAll(filter?: ProjectFilter): Promise<Project[]> {
    const conditions: string[] = [];
    const params: unknown[] = [];
    if (filter?.status) {
      conditions.push('status = ?');
      params.push(filter.status);
    }
    if (filter?.nameContains) {
      conditions.push('name LIKE ?');
      params.push(`%${filter.nameContains}%`);
    }
    const where = conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : '';
    const rows = await this.db.all<{ id: string; name: string; status: string }>(
      `SELECT id, name, status FROM projects${where}`,
      params
    );
    return rows.map(row => new Project({ id: row.id, name: row.name, status: row.status as ProjectStatus }));
  }

  async save(project: Project): Promise<void> {
    await this.db.run(
      `INSERT INTO projects (id, name, status) VALUES (?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET name = excluded.name, status = excluded.status`,
      [project.id, project.name, project.status]
    );
  }
}
