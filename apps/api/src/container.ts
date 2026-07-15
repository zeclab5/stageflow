import { DIContainer } from '@core/infrastructure/di/Container';
import { SQLiteProjectRepository } from '@core/infrastructure/repository/SQLiteProjectRepository';
import { initializeDatabase } from '@core/infrastructure/persistence/sqlite/SQLiteProvider';
import { CreateProject } from '@core/application/command/CreateProject';
import { UpdateProject } from '@core/application/command/UpdateProject';
import { CloseProject } from '@core/application/command/CloseProject';
import { GetProject } from '@core/application/query/GetProject';
import { ListProjects } from '@core/application/query/ListProjects';

export const container = new DIContainer();

let bootstrapped = false;

export async function bootstrapContainer() {
  if (bootstrapped) return;
  bootstrapped = true;

  const db = await initializeDatabase('/tmp/stageflow-api.sqlite');
  await db.run('CREATE TABLE IF NOT EXISTS projects ( id TEXT PRIMARY KEY, name TEXT NOT NULL, status TEXT NOT NULL DEFAULT \'draft\' );');

  const repo = new SQLiteProjectRepository(db);

  container.register('ProjectRepo', () => repo);
  container.register('CreateProject', () => new CreateProject(repo));
  container.register('UpdateProject', () => new UpdateProject(repo));
  container.register('CloseProject', () => new CloseProject(repo));
  container.register('GetProject', () => new GetProject(repo));
  container.register('ListProjects', () => new ListProjects(repo));
}
