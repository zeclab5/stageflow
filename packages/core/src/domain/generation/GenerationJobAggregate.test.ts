import { GenerationJob } from './GenerationJob';

describe('GenerationJob Aggregate', () => {
  test('creates generation job matching GenerationJobProps', () => {
    const job = new GenerationJob({
      id: 'g1',
      projectId: 'p1',
      providerRef: 'resolume',
      params: {},
      status: 'requested'
    });
    expect(job.id).toBe('g1');
    expect(job.providerRef).toBe('resolume');
    expect(job.status).toBe('requested');
  });
});
