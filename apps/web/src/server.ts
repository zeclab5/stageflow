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
        <a href="/scenes">Scenes</a>
        <a href="/screens">Screens</a>
        <a href="/library">Library</a>
        <a href="/works">Works</a>
        <a href="/blog">Blog</a>
        <a href="/plugins">Plugins</a>
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

app.get('/scenes', async (_req, res) => {
  const response = await fetch(`${API_BASE}/projects`);
  const projects = await response.json();
  res.send(layout('Scenes', `
    <section class="card">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <h2>Scenes</h2>
        <button id="new-scene" style="padding:8px 14px;">New Scene</button>
      </div>
      <ul id="scene-list" style="list-style:none;padding:0;margin-top:12px;"></ul>
    </section>
    <section class="card">
      <h2>Scene Properties</h2>
      <pre id="scene-detail" class="muted">Select a scene.</pre>
    </section>
    <script>
      (async () => {
        const listEl = document.getElementById('scene-list');
        const detailEl = document.getElementById('scene-detail');
        const projects = ${JSON.stringify(projects)};
        const projectId = projects[0]?.id;
        if (!projectId) {
          detailEl.textContent = 'Create a project first.';
          return;
        }
        document.getElementById('new-scene').addEventListener('click', async () => {
          await fetch('${API_BASE}/scenes?projectId=' + encodeURIComponent(projectId), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': 'test-api-key' },
            body: JSON.stringify({ name: 'Scene ' + (listEl.children.length + 1), order: listEl.children.length + 1 })
          });
          detailEl.textContent = '';
          load();
        });
        async function load() {
          const res = await fetch('${API_BASE}/scenes?projectId=' + encodeURIComponent(projectId), { headers: { 'x-api-key': 'test-api-key' } });
          const scenes = await res.json();
          listEl.innerHTML = '';
          for (const scene of scenes) {
            const li = document.createElement('li');
            li.className = 'card';
            li.textContent = scene.name;
            li.style.cursor = 'pointer';
            li.addEventListener('click', async () => {
              const r = await fetch('${API_BASE}/scenes/' + scene.id, { headers: { 'x-api-key': 'test-api-key' } });
              const data = await r.json();
              detailEl.textContent = JSON.stringify(data, null, 2);
            });
            listEl.appendChild(li);
          }
        }
        await load();
      })();
    </script>
  `));
});

app.get('/screens', async (_req, res) => {
  const response = await fetch(`${API_BASE}/projects`);
  const projects = await response.json();
  res.send(layout('Screens', `
    <section class="card">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <h2>Screens</h2>
        <button id="new-screen" style="padding:8px 14px;">New Screen</button>
      </div>
      <ul id="screen-list" style="list-style:none;padding:0;margin-top:12px;"></ul>
    </section>
    <section class="card">
      <h2>Screen Properties</h2>
      <pre id="screen-detail" class="muted">Select a screen.</pre>
    </section>
    <script>
      (async () => {
        const listEl = document.getElementById('screen-list');
        const detailEl = document.getElementById('screen-detail');
        const projects = ${JSON.stringify(projects)};
        const projectId = projects[0]?.id;
        if (!projectId) {
          detailEl.textContent = 'Create a project first.';
          return;
        }
        document.getElementById('new-screen').addEventListener('click', async () => {
          await fetch('${API_BASE}/screens?projectId=' + encodeURIComponent(projectId), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': 'test-api-key' },
            body: JSON.stringify({ name: 'Screen ' + (listEl.children.length + 1), type: 'Projection', resolution: { width: 1920, height: 1080 }, order: listEl.children.length + 1 })
          });
          detailEl.textContent = '';
          load();
        });
        async function load() {
          const res = await fetch('${API_BASE}/screens?projectId=' + encodeURIComponent(projectId), { headers: { 'x-api-key': 'test-api-key' } });
          const screens = await res.json();
          listEl.innerHTML = '';
          for (const screen of screens) {
            const li = document.createElement('li');
            li.className = 'card';
            li.textContent = screen.name;
            li.style.cursor = 'pointer';
            li.addEventListener('click', async () => {
              const r = await fetch('${API_BASE}/screens/' + screen.id, { headers: { 'x-api-key': 'test-api-key' } });
              const data = await r.json();
              detailEl.textContent = JSON.stringify(data, null, 2);
            });
            listEl.appendChild(li);
          }
        }
        await load();
      })();
    </script>
  `));
});

app.get('/library', async (_req, res) => {
  const response = await fetch(`${API_BASE}/projects`);
  const projects = await response.json();
  res.send(layout('Library', `
    <section class="card">
      <h2>Project Library</h2>
      <input id="asset-name" placeholder="Asset name" />
      <select id="asset-type">
        <option value="image">Image</option>
        <option value="video">Video</option>
        <option value="audio">Audio</option>
        <option value="text">Text</option>
      </select>
      <input id="asset-uri" placeholder="URI or path" />
      <button id="register-asset" style="margin-left:8px;">Add</button>
    </section>
    <section class="card">
      <h2>Assets</h2>
      <ul id="asset-list" style="list-style:none;padding:0;margin-top:12px;"></ul>
    </section>
    <script>
      (async () => {
        const listEl = document.getElementById('asset-list');
        const projects = ${JSON.stringify(projects)};
        const projectId = projects[0]?.id;
        if (!projectId) {
          listEl.innerHTML = '<li class="muted">Create a project first.</li>';
          return;
        }
        document.getElementById('register-asset').addEventListener('click', async () => {
          const name = document.getElementById('asset-name').value || 'Untitled';
          const type = document.getElementById('asset-type').value;
          const uri = document.getElementById('asset-uri').value || '/tmp/asset';
          await fetch('${API_BASE}/assets?projectId=' + encodeURIComponent(projectId), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': 'test-api-key' },
            body: JSON.stringify({ name, type, uri })
          });
          document.getElementById('asset-name').value = '';
          document.getElementById('asset-uri').value = '';
          load();
        });
        async function load() {
          const res = await fetch('${API_BASE}/assets?projectId=' + encodeURIComponent(projectId), { headers: { 'x-api-key': 'test-api-key' } });
          const assets = await res.json();
          listEl.innerHTML = '';
          for (const asset of assets) {
            const li = document.createElement('li');
            li.className = 'card';
            li.innerHTML = '<strong>' + asset.name + '</strong> <span class="muted">' + asset.type + '</span>';
            listEl.appendChild(li);
          }
        }
        await load();
      })();
    </script>
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
