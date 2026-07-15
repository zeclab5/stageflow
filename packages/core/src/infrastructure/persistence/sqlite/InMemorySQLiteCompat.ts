type Row = Record<string, unknown>;

export class InMemorySQLiteCompatRepository {
  private readonly items = new Map<string, Row>();
  constructor(private readonly table: string) {}

  async findById(id: string): Promise<Row | null> {
    return this.items.get(id) ?? null;
  }

  async save(row: Row): Promise<void> {
    this.items.set(String(row.id), { ...row });
  }

  async delete(id: string): Promise<void> {
    this.items.delete(id);
  }

  async list(where?: Partial<Row>): Promise<Row[]> {
    const all: Row[] = Array.from(this.items.values());
    if (!where) return all;
    return all.filter(row => Object.keys(where).every(key => row[key] === where[key]));
  }

  async count(where?: Partial<Row>): Promise<number> {
    return this.list(where).then(rows => rows.length);
  }
}

export function createCompatConnection() {
  return {
    projects: new InMemorySQLiteCompatRepository('projects'),
    scenes: new InMemorySQLiteCompatRepository('scenes'),
    prompts: new InMemorySQLiteCompatRepository('prompts'),
    assets: new InMemorySQLiteCompatRepository('assets'),
    generations: new InMemorySQLiteCompatRepository('generations'),
    integrations: new InMemorySQLiteCompatRepository('integrations')
  };
}
