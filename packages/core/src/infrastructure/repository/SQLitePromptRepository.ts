import { SQLiteConnection } from '../persistence/sqlite/SQLiteConnection';
import { Prompt, PromptId } from '../../domain/prompt/PromptTemplate';

export class SQLitePromptRepository {
  constructor(private readonly db: SQLiteConnection) {}

  async findById(id: PromptId): Promise<Prompt | null> {
    const row = await this.db.get<{ id: string; projectId: string; template: string; variables: string; version: number }>(
      'SELECT id, project_id as projectId, template, variables, version FROM prompts WHERE id = ?',
      [id]
    );
    if (!row) return null;
    return new Prompt({ id: row.id, projectId: row.projectId, template: row.template, variables: JSON.parse(row.variables), version: row.version });
  }

  async save(prompt: Prompt): Promise<void> {
    await this.db.run(
      `INSERT INTO prompts (id, project_id, template, variables, version) VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET template = excluded.template, variables = excluded.variables, version = excluded.version`,
      [prompt.id, prompt.projectId, prompt.template, JSON.stringify(prompt.variables), prompt.version]
    );
  }
}
