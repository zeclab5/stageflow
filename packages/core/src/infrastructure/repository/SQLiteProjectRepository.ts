import { SQLiteConnection } from '../persistence/sqlite/SQLiteConnection';
import { Project, ProjectId, ProjectStatus } from '../../domain/project/Project';

export class SQLiteProjectRepository {
  constructor(private readonly db: SQLiteConnection) {}

  async findById(id: ProjectId): Promise<Project | null> {
    const row = await this.db.get<{ id: string; name: string; status: string }>(
      'SELECT id, name, status FROM projects WHERE id = ?',
      [id]
    );
    if (!row) return null;
    return new Project({ id: row.id, name: row.name, status: row.status as ProjectStatus });
  }

  async save(project: Project): Promise<void> {
    await this.db.run(
      `INSERT INTO projects (id, name, status) VALUES (?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET name = excluded.name, status = excluded.status`,
      [project.id, project.name, project.status]
    );
  }
}
