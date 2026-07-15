import { DIContainer } from 'stageflow-core';
import { SQLiteProjectRepository } from 'stageflow-core';
import { initializeDatabase } from 'stageflow-core';
import { CreateProject } from 'stageflow-core';
import { UpdateProject } from 'stageflow-core';
import { CloseProject } from 'stageflow-core';
import { GetProject } from 'stageflow-core';
import { ListProjects } from 'stageflow-core';
import { config } from './config';

export const container = new DIContainer();

let bootstrapped = false;

export async function bootstrapContainer() {
  if (bootstrapped) return;
  bootstrapped = true;

  const db = await initializeDatabase(config.dbPath);
  await db.run('CREATE TABLE IF NOT EXISTS projects ( id TEXT PRIMARY KEY, name TEXT NOT NULL, status TEXT NOT NULL DEFAULT \'draft\' );');

  const repo = new SQLiteProjectRepository(db);

  container.register('ProjectRepo', () => repo);
  container.register('CreateProject', () => new CreateProject(repo));
  container.register('UpdateProject', () => new UpdateProject(repo));
  container.register('CloseProject', () => new CloseProject(repo));
  container.register('GetProject', () => new GetProject(repo));
  container.register('ListProjects', () => new ListProjects(repo));
}
