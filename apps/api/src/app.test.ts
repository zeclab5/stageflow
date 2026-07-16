import { createApp } from './app';
import request from 'supertest';

describe('API integration', () => {
  let app: Awaited<ReturnType<typeof createApp>>;

  beforeAll(async () => {
    app = await createApp();
  });

  it('GET /projects returns list', async () => {
    const response = await request(app)
      .get('/projects')
      .set('x-api-key', 'test-api-key');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('POST /projects creates project', async () => {
    const response = await request(app)
      .post('/projects')
      .set('x-api-key', 'test-api-key')
      .send({ name: 'Test Project API' });
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ name: 'Test Project API', status: 'draft' });
  });

  it('GET /projects/:id returns project', async () => {
    const create = await request(app)
      .post('/projects')
      .set('x-api-key', 'test-api-key')
      .send({ name: 'Auth Test Project' });
    const projectId = create.body.id;
    const response = await request(app)
      .get(`/projects/${projectId}`)
      .set('x-api-key', 'test-api-key');
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(projectId);
  });

  it('PATCH /projects/:id updates project', async () => {
    const create = await request(app)
      .post('/projects')
      .set('x-api-key', 'test-api-key')
      .send({ name: 'Update Auth Test' });
    const projectId = create.body.id;
    const response = await request(app)
      .patch(`/projects/${projectId}`)
      .set('x-api-key', 'test-api-key')
      .send({ name: 'Updated Auth Project' });
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Updated Auth Project');
  });

  it('POST /projects/:id/close closes project', async () => {
    const create = await request(app)
      .post('/projects')
      .set('x-api-key', 'test-api-key')
      .send({ name: 'Close Auth Test' });
    const projectId = create.body.id;
    const response = await request(app)
      .post(`/projects/${projectId}/close`)
      .set('x-api-key', 'test-api-key');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('closed');
  });

  it('GET /api/works returns list', async () => {
    const response = await request(app).get('/api/works').set('x-api-key', 'test-api-key');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /api/blog returns list', async () => {
    const response = await request(app).get('/api/blog').set('x-api-key', 'test-api-key');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /api/plugins returns manifests and loaded', async () => {
    const response = await request(app).get('/api/plugins').set('x-api-key', 'test-api-key');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('manifests');
    expect(response.body).toHaveProperty('loaded');
  });
});

describe('API auth', () => {
  let app: Awaited<ReturnType<typeof createApp>>;

  beforeAll(async () => {
    process.env.API_KEY = 'test-api-key';
    app = await createApp();
  });

  afterAll(() => {
    delete process.env.API_KEY;
  });

  it('rejects request without API key', async () => {
    const response = await request(app).get('/projects');
    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({ error: 'unauthorized' });
  });

  it('accepts valid API key via x-api-key', async () => {
    const response = await request(app).get('/projects').set('x-api-key', 'test-api-key');
    expect(response.status).toBe(200);
  });

  it('accepts valid API key via Authorization Bearer', async () => {
    const response = await request(app)
      .get('/projects')
      .set('Authorization', 'Bearer test-api-key');
    expect(response.status).toBe(200);
  });

  it('rejects request with invalid API key', async () => {
    const response = await request(app).get('/projects').set('x-api-key', 'bad-secret');
    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({ error: 'unauthorized' });
  });
});
