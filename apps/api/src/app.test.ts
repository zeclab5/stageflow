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

  it('GET /scenes returns list', async () => {
    const response = await request(app).get('/scenes').set('x-api-key', 'test-api-key');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /prompts returns list', async () => {
    const response = await request(app).get('/prompts').set('x-api-key', 'test-api-key');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /assets returns list', async () => {
    const response = await request(app).get('/assets').set('x-api-key', 'test-api-key');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /generations returns list', async () => {
    const response = await request(app).get('/generations').set('x-api-key', 'test-api-key');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /integrations returns list', async () => {
    const response = await request(app).get('/integrations').set('x-api-key', 'test-api-key');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /projects/:id returns 404 for missing project', async () => {
    const response = await request(app)
      .get('/projects/__missing__')
      .set('x-api-key', 'test-api-key');
    expect(response.status).toBe(404);
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

  it('rejects missing auth on cues even without API key', async () => {
    const create = await request(app)
      .post('/projects')
      .set('x-api-key', 'test-api-key')
      .send({ name: 'Auth Cue Check' });
    const projectId = create.body.id;
    const scene = await request(app)
      .post('/scenes?projectId=' + encodeURIComponent(projectId))
      .set('x-api-key', 'test-api-key')
      .send({ name: 'Scene Cue', order: 1 });
    const cue = await request(app)
      .post('/cues')
      .set('x-api-key', 'test-api-key')
      .send({ sceneId: scene.body.id, name: 'Secure Cue', timelinePosition: 1 });
    const response = await request(app).patch('/cues/' + cue.body.id).send({ name: 'Hacked' });
    expect(response.status).toBe(401);
  });
});

describe('API cues', () => {
  let app: Awaited<ReturnType<typeof createApp>>;
  let projectId: string;
  let sceneId: string;

  beforeAll(async () => {
    process.env.API_KEY = 'test-api-key';
    app = await createApp();

    const project = await request(app)
      .post('/projects')
      .set('x-api-key', 'test-api-key')
      .send({ name: 'Cue Test Project' });
    projectId = project.body.id;

    const scene = await request(app)
      .post('/scenes?projectId=' + encodeURIComponent(projectId))
      .set('x-api-key', 'test-api-key')
      .send({ name: 'Scene 1', order: 1 });
    sceneId = scene.body.id;
  });

  afterAll(() => {
    delete process.env.API_KEY;
  });

  it('POST /cues creates cue', async () => {
    const response = await request(app)
      .post('/cues')
      .set('x-api-key', 'test-api-key')
      .send({ sceneId, name: 'Intro', timelinePosition: 1 });
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ sceneId, name: 'Intro', status: 'pending' });
  });

  it('GET /cues returns cues for scene', async () => {
    const response = await request(app)
      .get('/cues')
      .set('x-api-key', 'test-api-key')
      .query({ sceneId });
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('PATCH /cues/:id renames cue', async () => {
    const cue = await request(app)
      .post('/cues')
      .set('x-api-key', 'test-api-key')
      .send({ sceneId, name: 'Rename Me', timelinePosition: 2 });
    const response = await request(app)
      .patch(`/cues/${cue.body.id}`)
      .set('x-api-key', 'test-api-key')
      .send({ name: 'Renamed' });
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Renamed');
  });

  it('DELETE /cues/:id removes cue', async () => {
    const cue = await request(app)
      .post('/cues')
      .set('x-api-key', 'test-api-key')
      .send({ sceneId, name: 'Delete Me', timelinePosition: 3 });
    const response = await request(app)
      .delete(`/cues/${cue.body.id}`)
      .set('x-api-key', 'test-api-key');
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(cue.body.id);
  });
});
