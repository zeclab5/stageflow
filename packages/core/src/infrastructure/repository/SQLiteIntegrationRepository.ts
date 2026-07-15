import { SQLiteConnection } from '../persistence/sqlite/SQLiteConnection';
import { IntegrationProfile, IntegrationId, ConnectionStatus } from '../../domain/integration/IntegrationProfile';

export class SQLiteIntegrationRepository {
  constructor(private readonly db: SQLiteConnection) {}

  async findById(id: IntegrationId): Promise<IntegrationProfile | null> {
    const row = await this.db.get<{ id: string; name: string; type: string; config: string; status: string }>(
      'SELECT id, name, type, config, status FROM integrations WHERE id = ?',
      [id]
    );
    if (!row) return null;
    return new IntegrationProfile({
      id: row.id,
      name: row.name,
      type: row.type,
      config: JSON.parse(row.config),
      status: row.status as ConnectionStatus
    });
  }

  async save(integration: IntegrationProfile): Promise<void> {
    await this.db.run(
      `INSERT INTO integrations (id, name, type, config, status) VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET status = excluded.status`,
      [integration.id, integration.name, integration.type, JSON.stringify(integration.config), integration.status]
    );
  }
}
