import { Database } from 'sqlite3';

export class SQLiteConnection {
  constructor(private readonly db: Database) {}

  static async open(path: string): Promise<SQLiteConnection> {
    return new Promise((resolve, reject) => {
      const db = new Database(path, (err: Error | null) => {
        if (err) reject(err);
        else resolve(new SQLiteConnection(db));
      });
    });
  }

  run(sql: string, params: unknown[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err: Error | null) {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  all<T>(sql: string, params: unknown[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err: Error | null, rows: T[]) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  get<T>(sql: string, params: unknown[] = []): Promise<T | null> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err: Error | null, row: T | null) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err: Error | null) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}
