import { Project, ProjectId } from '../domain/project/Project';
import { ProjectRepository } from '../domain/project/ProjectRepository';
import { CreateProject } from './command/CreateProject';
import { UpdateProject } from './command/UpdateProject';
import { CloseProject } from './command/CloseProject';
import { GetProject } from './query/GetProject';
import { ListProjects } from './query/ListProjects';

class FakeProjectRepository implements ProjectRepository {
  saved: Project[] = [];
  async findById(id: ProjectId): Promise<Project | null> {
    return this.saved.find(p => p.id === id) ?? null;
  }
  async save(project: Project): Promise<void> {
    this.saved = [...this.saved.filter(p => p.id !== project.id), project];
  }
}

describe('Project Aggregate', () => {
  let repo: FakeProjectRepository;
  let create: CreateProject;
  let update: UpdateProject;
  let close: CloseProject;
  let get: GetProject;
  let list: ListProjects;

  beforeEach(() => {
    repo = new FakeProjectRepository();
    create = new CreateProject(repo);
    update = new UpdateProject(repo);
    close = new CloseProject(repo);
    get = new GetProject(repo);
    list = new ListProjects(repo);
  });

  test('create requires name', async () => {
    await expect(create.execute('')).rejects.toThrow('project name is required');
    await expect(create.execute('   ')).rejects.toThrow('project name is required');
  });

  test('create returns draft project', async () => {
    const project = await create.execute('alpha');
    expect(project.name).toBe('alpha');
    expect(project.status).toBe('draft');
  });

  test('update changes name', async () => {
    const project = await create.execute('alpha');
    const updated = await update.execute(project.id, { name: 'beta' });
    expect(updated.name).toBe('beta');
  });

  test('update blocked when closed', async () => {
    const project = await create.execute('alpha');
    await close.execute(project.id);
    await expect(update.execute(project.id, { name: 'beta' })).rejects.toThrow('closed project cannot be updated');
  });

  test('close sets status closed', async () => {
    const project = await create.execute('alpha');
    const closed = await close.execute(project.id);
    expect(closed.status).toBe('closed');
  });

  test('double close rejects', async () => {
    const project = await create.execute('alpha');
    await close.execute(project.id);
    await expect(close.execute(project.id)).rejects.toThrow('already closed');
  });

  test('get project by id', async () => {
    const project = await create.execute('alpha');
    const found = await get.execute(project.id);
    expect(found.id).toBe(project.id);
  });

  test('list returns empty until implementation', async () => {
    await create.execute('alpha');
    const items = await list.execute();
    expect(items).toHaveLength(0);
  });
});
