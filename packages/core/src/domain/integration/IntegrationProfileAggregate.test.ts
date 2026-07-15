import { IntegrationProfile } from './IntegrationProfile';

describe('IntegrationProfile Aggregate', () => {
  test('creates integration profile using valid ConnectionStatus', () => {
    const profile = new IntegrationProfile({ id: 'i1', name: 'Resolume', type: 'resolume', config: {}, status: 'connected' });
    expect(profile.id).toBe('i1');
    expect(profile.name).toBe('Resolume');
    expect(profile.status).toBe('connected');
  });
});
