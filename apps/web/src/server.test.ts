import request from 'supertest';
import { app } from './server';

const FIXTURE = {
  works: [{ slug: '001', title: 'Sample Work', description: 'Example stage design work', date: '2026-07-15', client: 'Internal', thumbnail: '/content/works/001/cover.jpg' }],
  blog: [{ slug: '001', title: 'Sample Blog', description: 'Example blog post', date: '2026-07-15', tags: ['stage', 'workflow'] }],
  plugins: { manifests: [{ name: 'health', version: '0.1.0', category: 'ui' }], loaded: [{ name: 'health' }] }
};

const RESPONSE_BASE = {
  ok: true,
  status: 200,
};

function createMockResponse(data: unknown, ok = true, status = 200): Response {
  const base = { ok, status } as Record<string, unknown>;
  return Object.assign(
    {
      json: async () => data,
      text: async () => JSON.stringify(data),
    } as Response,
    base
  );
}

describe('Web routes', () => {
  let originalFetch: typeof fetch;

  beforeAll(() => {
    originalFetch = globalThis.fetch;
  });

  beforeEach(() => {
    (globalThis as unknown as Record<string, unknown>).__originalFetch = originalFetch;
    (globalThis as unknown as Record<string, unknown>).fetch = ((input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
      if (url.includes('/api/works/')) {
        const item = FIXTURE.works.find(w => url.endsWith(`/${w.slug}`));
        if (!item) return Promise.resolve(createMockResponse(null, false, 404));
        return Promise.resolve(createMockResponse(item));
      }
      if (url.includes('/api/works')) return Promise.resolve(createMockResponse(FIXTURE.works));
      if (url.includes('/api/blog/')) {
        const item = FIXTURE.blog.find(b => url.endsWith(`/${b.slug}`));
        if (!item) return Promise.resolve(createMockResponse(null, false, 404));
        return Promise.resolve(createMockResponse(item));
      }
      if (url.includes('/api/blog')) return Promise.resolve(createMockResponse(FIXTURE.blog));
      if (url.includes('/api/plugins')) return Promise.resolve(createMockResponse(FIXTURE.plugins));
      return originalFetch(input);
    }) as typeof fetch;
  });

  afterEach(() => {
    (globalThis as unknown as Record<string, unknown>).fetch = (globalThis as unknown as Record<string, unknown>).__originalFetch as typeof fetch;
  });

  it('GET / returns 200 and StageFlow title', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('StageFlow');
  });

  it('GET /works returns works list page', async () => {
    const response = await request(app).get('/works');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Works');
  });

  it('GET /works/:slug returns work detail page', async () => {
    const response = await request(app).get('/works/001');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Sample Work');
  });

  it('GET /blog returns blog list page', async () => {
    const response = await request(app).get('/blog');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Blog');
  });

  it('GET /blog/:slug returns blog detail page', async () => {
    const response = await request(app).get('/blog/001');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Sample Blog');
  });

  it('GET /plugins returns plugins page', async () => {
    const response = await request(app).get('/plugins');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Plugins');
  });

  it('GET /unknown returns 404', async () => {
    const response = await request(app).get('/unknown');
    expect(response.status).toBe(404);
    expect(response.text).toContain('Not found');
  });

  it('GET /works/:slug returns 404 when missing', async () => {
    const response = await request(app).get('/works/999');
    expect(response.status).toBe(404);
    expect(response.text).toContain('Not found');
  });

  it('GET /blog/:slug returns 404 when missing', async () => {
    const response = await request(app).get('/blog/999');
    expect(response.status).toBe(404);
    expect(response.text).toContain('Not found');
  });

  it('Home page includes navigation links', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('/works');
    expect(response.text).toContain('/blog');
    expect(response.text).toContain('/plugins');
  });
});
