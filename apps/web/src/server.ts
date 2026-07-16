import express from 'express';

const app = express();
export { app };
export default app;
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const SELF = 'http://localhost:' + PORT;
const API_BASE = process.env.API_BASE || SELF;

app.use(express.static('public'));

const layout = (title: string, body: string) => `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title} - StageFlow</title>
    <style>
      body { font-family: sans-serif; margin: 0; padding: 24px; }
      header { display: flex; align-items: center; justify-content: space-between; }
      nav a { margin-right: 12px; text-decoration: none; color: #111827; }
      .card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; margin-top: 12px; }
      .muted { color: #6b7280; }
      a { color: #2563eb; }
      code { background: #f3f4f6; padding: 2px 6px; border-radius: 6px; }
    </style>
  </head>
  <body>
    <header>
      <h1>StageFlow</h1>
      <nav>
        <a href="/">Home</a>
        <a href="/api/works">Works</a>
        <a href="/api/blog">Blog</a>
        <a href="/api/plugins">Plugins</a>
      </nav>
    </header>
    <main>${body}</main>
  </body>
</html>`;

app.get('/', (_req, res) => {
  res.send(layout('Home', `
    <section class="card">
      <h2>Welcome</h2>
      <p class="muted">Plugin-first stage production platform.</p>
    </section>
  `));
});

app.get('/works', async (_req, res) => {
  const response = await fetch(`${API_BASE}/api/works`);
  const data = await response.json();
  const body = data.map((item: { slug: string; title?: string; description?: string }) => `
    <article class="card">
      <h2><a href="/works/${item.slug}">${item.title ?? item.slug}</a></h2>
      <p class="muted">${item.description ?? ''}</p>
    </article>
  `).join('');
  res.send(layout('Works', `<section>${body || '<p class="muted">No works yet.</p>'}</section>`));
});

app.get('/works/:slug', async (req, res) => {
  const response = await fetch(`${API_BASE}/api/works/${req.params.slug}`);
  if (!response.ok) return res.status(404).send(layout('Not found', '<p>Not found</p>'));
  const data = await response.json();
  res.send(layout(data.title ?? `Work ${data.slug}`, `
    <article class="card">
      <h2>${data.title ?? data.slug}</h2>
      <p class="muted">${data.date ? data.date + ' · ' : ''}${[data.client, data.description].filter(Boolean).join(' | ')}</p>
      ${data.thumbnail ? `<div style="margin-top:12px"><img src="${data.thumbnail}" alt="${data.title ?? ''}" style="max-width:100%;border-radius:12px;border:1px solid #e5e7eb;" /></div>` : ''}
      ${data.description ? `<p style="margin-top:12px">${data.description}</p>` : ''}
    </article>
  `));
});

app.get('/blog', async (_req, res) => {
  const response = await fetch(`${API_BASE}/api/blog`);
  const data = await response.json();
  const body = data.map((item: { slug: string; title?: string; description?: string }) => `
    <article class="card">
      <h2><a href="/blog/${item.slug}">${item.title ?? item.slug}</a></h2>
      <p class="muted">${item.description ?? ''}</p>
    </article>
  `).join('');
  res.send(layout('Blog', `<section>${body || '<p class="muted">No posts yet.</p>'}</section>`));
});

app.get('/blog/:slug', async (req, res) => {
  const response = await fetch(`${API_BASE}/api/blog/${req.params.slug}`);
  if (!response.ok) return res.status(404).send(layout('Not found', '<p>Not found</p>'));
  const data = await response.json();
  const tags = Array.isArray(data.tags) ? data.tags.map((tag: string) => `<span style="border:1px solid #e5e7eb;border-radius:999px;padding:2px 10px;font-size:12px;margin-right:6px;color:#374151;">${tag}</span>`).join('') : '';
  res.send(layout(data.title ?? `Blog ${data.slug}`, `
    <article class="card">
      <h2>${data.title ?? data.slug}</h2>
      <p class="muted">${data.date ? data.date + ' · ' : ''}${data.description ?? ''}</p>
      ${data.description ? `<p style="margin-top:12px">${data.description}</p>` : ''}
      ${tags ? `<div style="margin-top:12px">${tags}</div>` : ''}
    </article>
  `));
});

app.get('/plugins', async (_req, res) => {
  const response = await fetch(`${API_BASE}/api/plugins`);
  const data = await response.json();
  res.send(layout('Plugins', `
    <section class="card">
      <h2>Manifests</h2>
      <pre>${JSON.stringify(data.manifests ?? [], null, 2)}</pre>
    </section>
    <section class="card">
      <h2>Loaded</h2>
      <pre>${JSON.stringify(data.loaded ?? [], null, 2)}</pre>
    </section>
  `));
});

app.use((_req, res) => res.status(404).send(layout('Not found', '<p>Not found</p>')));

if (!process.env.JEST_WORKER_ID) {
  app.listen(PORT, () => console.log(`Web listening on http://localhost:${PORT}`));
}
