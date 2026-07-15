import { Project } from './Project';
import { ProjectStatus } from './ProjectStatus';

describe('Project Aggregate', () => {
  test('creates project with initial status', () => {
    const project = new Project({ id: 'p1', name: 'A', status: 'draft' as ProjectStatus });
    expect(project.id).toBe('p1');
    expect(project.name).toBe('A');
    expect(project.status).toBe('draft');
  });

  test('project status is read-only from props', () => {
    const project = new Project({ id: 'p1', name: 'A', status: 'active' as ProjectStatus });
    expect(project.status).toBe('active');
  });
});
