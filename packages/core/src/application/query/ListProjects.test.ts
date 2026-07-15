import { Project } from '../../domain/project/Project';
import { InMemoryProjectRepository } from '../../infrastructure/repository/InMemoryProjectRepository';
import { ListProjects } from './ListProjects';

describe('ListProjects', () => {
  async function makeRepo() {
    const repo = new InMemoryProjectRepository();
    await repo.save(new Project({ id: 'p1', name: 'Opera Alpha', status: 'draft' }));
    await repo.save(new Project({ id: 'p2', name: 'Ballet Beta', status: 'active' }));
    await repo.save(new Project({ id: 'p3', name: 'Opera Gamma', status: 'closed' }));
    return repo;
  }

  test('returns all projects without filter', async () => {
    const list = new ListProjects(await makeRepo());
    const projects = await list.execute();
    expect(projects).toHaveLength(3);
  });

  test('filters by status', async () => {
    const list = new ListProjects(await makeRepo());
    const projects = await list.execute({ status: 'active' });
    expect(projects).toHaveLength(1);
    expect(projects[0].id).toBe('p2');
  });

  test('filters by nameContains (case-insensitive)', async () => {
    const list = new ListProjects(await makeRepo());
    const projects = await list.execute({ nameContains: 'opera' });
    expect(projects.map(p => p.id)).toEqual(['p1', 'p3']);
  });

  test('combines status and nameContains filters', async () => {
    const list = new ListProjects(await makeRepo());
    const projects = await list.execute({ status: 'closed', nameContains: 'Opera' });
    expect(projects).toHaveLength(1);
    expect(projects[0].id).toBe('p3');
  });
});
