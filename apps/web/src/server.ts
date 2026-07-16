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
        <a href="/show-flow">Show Flow</a>
        <a href="/cues">Cues</a>
        <a href="/library">Library</a>
        <a href="/works">Works</a>
        <a href="/blog">Blog</a>
        <a href="/plugins">Plugins</a>
        <a href="/inspector">Inspector</a>
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
              detailEl.innerHTML = '<a href="/scenes/' + scene.id + '">Open Canvas</a><br><pre>' + JSON.stringify(data, null, 2) + '</pre>';
            });
            listEl.appendChild(li);
          }
        }
        await load();
      })();
    </script>
  `));
});

app.get('/scenes/:id', async (req, res) => {
  const sceneRes = await fetch(`${API_BASE}/scenes/${req.params.id}`);
  if (!sceneRes.ok) return res.status(404).send(layout('Not found', '<p>Not found</p>'));
  const scene = await sceneRes.json();
  res.send(layout('Scene: ' + scene.name, `
    <section class="card">
      <h2>${scene.name}</h2>
      <p class="muted">Project ${scene.projectId} · Order ${scene.order}${scene.active ? ' · Active' : ''}</p>
      <div id="canvas" style="position:relative;width:100%;aspect-ratio:16/9;background:#0b1220;border-radius:12px;overflow:hidden;border:1px solid #1f2937;"></div>
      <div style="margin-top:12px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
        <input id="asset-x" placeholder="x" style="width:70px" />
        <input id="asset-y" placeholder="y" style="width:70px" />
        <input id="asset-w" placeholder="w" style="width:70px" />
        <input id="asset-h" placeholder="h" style="width:70px" />
        <button id="add-image" style="padding:8px 12px;">Add</button>
        <button id="update-selected" style="padding:8px 12px;">Update Selected</button>
        <button id="delete-selected" style="padding:8px 12px;">Delete Selected</button>
      </div>
      <h3 style="margin-top:12px;">Objects</h3>
      <div id="output-panel" style="margin-top:8px;">
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
          <select id="screen-options" style="padding:8px 12px;"></select>
          <button id="add-output" style="padding:8px 12px;">Assign Output</button>
        </div>
        <ul id="object-list" style="list-style:none;padding:0;margin-top:8px;"></ul>
      </div>
    </section>
    <script>
      (async () => {
        const canvasEl = document.getElementById('canvas');
        const listEl = document.getElementById('object-list');
        const screenEl = document.getElementById('screen-options');
        const addOutputBtn = document.getElementById('add-output');
        const projectId = '${scene.projectId}';
        const sceneId = '${req.params.id}';
        let selectedObjectId = null;
        const screenRes = await fetch('${API_BASE}/screens?projectId=' + encodeURIComponent(projectId), { headers: { 'x-api-key': 'test-api-key' } });
        const screens = screenRes.ok ? await screenRes.json() : [];
        screenEl.innerHTML = screens.map((s: any) => '<option value="' + s.id + '">' + s.name + '</option>').join('');
        async function loadObjects() {
          const r = await fetch('${API_BASE}/scenes/' + encodeURIComponent(sceneId) + '/objects', { headers: { 'x-api-key': 'test-api-key' } });
          const objects = await r.json();
          listEl.innerHTML = '';
          canvasEl.innerHTML = '';
          selectedObjectId = null;
          for (const object of objects) {
            const assetRes = await fetch('${API_BASE}/assets/' + object.assetId + '?projectId=' + encodeURIComponent(projectId), { headers: { 'x-api-key': 'test-api-key' } });
            const asset = assetRes.ok ? await assetRes.json() : {};
            const el = document.createElement('div');
            el.textContent = asset.name || object.assetId;
            el.style.position = 'absolute';
            el.style.left = object.x + 'px';
            el.style.top = object.y + 'px';
            el.style.width = object.width + 'px';
            el.style.height = object.height + 'px';
            el.style.background = asset.type === 'image' ? '#334155' : '#2563eb';
            el.style.borderRadius = '12px';
            el.style.border = '1px solid #e5e7eb';
            el.style.color = '#fff';
            el.style.display = 'flex';
            el.style.alignItems = 'center';
            el.style.justifyContent = 'center';
            el.style.fontSize = '12px';
            el.style.cursor = 'pointer';
            el.addEventListener('click', () => {
              selectedObjectId = object.id;
              document.getElementById('asset-x').value = object.x;
              document.getElementById('asset-y').value = object.y;
              document.getElementById('asset-w').value = object.width;
              document.getElementById('asset-h').value = object.height;
            });
            canvasEl.appendChild(el);
            const li = document.createElement('li');
            li.className = 'card';
            li.textContent = (asset.name || object.assetId) + ' (' + object.x + ',' + object.y + ') outputs:' + (object.outputs || []).join(',') || 'None';
            li.style.cursor = 'pointer';
            li.addEventListener('click', () => {
              selectedObjectId = object.id;
              document.getElementById('asset-x').value = object.x;
              document.getElementById('asset-y').value = object.y;
              document.getElementById('asset-w').value = object.width;
              document.getElementById('asset-h').value = object.height;
            });
            const assignBtn = document.createElement('button');
            assignBtn.textContent = 'Assign Output';
            assignBtn.style.marginLeft = '8px';
            assignBtn.addEventListener('click', async () => {
              const current = object.outputs || [];
              const next = current.includes(screenEl.value) ? current.filter((v: string) => v !== screenEl.value) : [...current, screenEl.value];
              await fetch('${API_BASE}/scenes/objects/' + object.id, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'x-api-key': 'test-api-key' },
                body: JSON.stringify({ outputs: next })
              });
              loadObjects();
            });
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.style.marginLeft = '8px';
            deleteBtn.addEventListener('click', async () => {
              await fetch('${API_BASE}/scenes/objects/' + object.id, { method: 'DELETE', headers: { 'x-api-key': 'test-api-key' } });
              loadObjects();
            });
            li.appendChild(assignBtn);
            li.appendChild(deleteBtn);
            listEl.appendChild(li);
          }
        }
        document.getElementById('add-image').addEventListener('click', async () => {
          const createRes = await fetch('${API_BASE}/assets?projectId=' + encodeURIComponent(projectId), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': 'test-api-key' },
            body: JSON.stringify({ name: 'Image ' + (listEl.children.length + 1), type: 'image', uri: '/tmp/image.png' })
          });
          const asset = await createRes.json();
          await fetch('${API_BASE}/scenes/' + encodeURIComponent(sceneId) + '/assets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': 'test-api-key' },
            body: JSON.stringify({ assetId: asset.id, x: document.getElementById('asset-x').value || 0, y: document.getElementById('asset-y').value || 0, width: document.getElementById('asset-w').value || 200, height: document.getElementById('asset-h').value || 200 })
          });
          loadObjects();
        });
        document.getElementById('update-selected').addEventListener('click', async () => {
          if (!selectedObjectId) return;
          await fetch('${API_BASE}/scenes/objects/' + selectedObjectId, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'x-api-key': 'test-api-key' },
            body: JSON.stringify({
              x: Number(document.getElementById('asset-x').value || 0),
              y: Number(document.getElementById('asset-y').value || 0),
              width: Number(document.getElementById('asset-w').value || 200),
              height: Number(document.getElementById('asset-h').value || 200),
            })
          });
          loadObjects();
        });
        document.getElementById('delete-selected').addEventListener('click', async () => {
          if (!selectedObjectId) return;
          await fetch('${API_BASE}/scenes/objects/' + selectedObjectId, { method: 'DELETE', headers: { 'x-api-key': 'test-api-key' } });
          loadObjects();
        });
        addOutputBtn.addEventListener('click', () => {
          loadObjects();
        });
        await loadObjects();
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
      <div id="screen-form" style="display:flex;flex-direction:column;gap:8px;max-width:420px;">
        <input id="screen-name" placeholder="name" style="padding:8px 12px;" />
        <select id="screen-type" style="padding:8px 12px;">
          <option value="Projection">Projection</option>
          <option value="Monitor">Monitor</option>
          <option value="LED">LED</option>
          <option value="Preview">Preview</option>
        </select>
        <input id="screen-w" placeholder="width" style="padding:8px 12px;" />
        <input id="screen-h" placeholder="height" style="padding:8px 12px;" />
        <label style="display:flex;align-items:center;gap:8px;">
          <input id="screen-enabled" type="checkbox" checked />
          <span>Enabled</span>
        </label>
        <div style="display:flex;gap:8px;">
          <button id="save-screen" style="padding:8px 14px;">Save</button>
          <button id="delete-screen" style="padding:8px 14px;">Delete</button>
        </div>
      </div>
      <h3 style="margin-top:16px;">Screen Preview</h3>
      <div id="screen-preview" style="margin-top:8px;background:#0b1220;border-radius:12px;border:1px solid #1f2937;padding:8px;min-height:140px;color:#6b7280;">Select a screen.</div>
    </section>
    <script>
      (async () => {
        const listEl = document.getElementById('screen-list');
        const detailEl = document.querySelector('#screen-form + div pre') || document.createElement('pre');
        const projects = ${JSON.stringify(projects)};
        const projectId = projects[0]?.id;
        if (!projectId) {
          document.getElementById('screen-preview').textContent = 'Create a project first.';
          return;
        }
        let selectedId = null;
        document.getElementById('new-screen').addEventListener('click', async () => {
          await fetch('${API_BASE}/screens?projectId=' + encodeURIComponent(projectId), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': 'test-api-key' },
            body: JSON.stringify({ name: 'Screen ' + (listEl.children.length + 1), type: 'Projection', resolution: { width: 1920, height: 1080 }, order: listEl.children.length + 1 })
          });
          await load();
        });
        async function load() {
          const res = await fetch('${API_BASE}/screens?projectId=' + encodeURIComponent(projectId), { headers: { 'x-api-key': 'test-api-key' } });
          const screens = await res.json();
          listEl.innerHTML = '';
          for (const screen of screens) {
            const li = document.createElement('li');
            li.className = 'card';
            li.textContent = screen.name + ' (' + screen.type + ' ' + (screen.resolution?.width || 0) + 'x' + (screen.resolution?.height || 0) + ')';
            li.style.cursor = 'pointer';
            li.addEventListener('click', async () => {
              selectedId = screen.id;
              document.getElementById('screen-name').value = screen.name || '';
              document.getElementById('screen-type').value = screen.type || 'Projection';
              document.getElementById('screen-w').value = screen.resolution?.width || '';
              document.getElementById('screen-h').value = screen.resolution?.height || '';
              document.getElementById('screen-enabled').checked = Boolean(screen.enabled);
              const preview = document.getElementById('screen-preview');
              preview.textContent = 'Loading preview...';
              try {
                const sceneRes = await fetch('${API_BASE}/scenes?projectId=' + encodeURIComponent(projectId), { headers: { 'x-api-key': 'test-api-key' } });
                const scenes = await sceneRes.json();
                const sceneId = scenes[0]?.id;
                if (!sceneId) { preview.textContent = 'Create a scene to preview'; return; }
                const r = await fetch('${API_BASE}/api/render/scene/' + encodeURIComponent(sceneId) + '?projectId=' + encodeURIComponent(projectId) + '&screenId=' + encodeURIComponent(screen.id), { headers: { 'x-api-key': 'test-api-key' } });
                const data = await r.json();
                if (!data?.trees?.length) { preview.textContent = 'No render tree'; return; }
                const tree = data.trees[0];
                preview.innerHTML = '<strong>' + tree.screenId + '</strong><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;">' + tree.objects.map((o: any) => '<div style="width:80px;height:80px;background:#2563eb;border:1px solid #e5e7eb;border-radius:10px;color:#fff;font-size:11px;display:flex;align-items:center;justify-content:center;">' + o.assetId + '</div>').join('') + '</div>';
              } catch (e) {
                preview.textContent = 'Preview error: ' + e.message;
              }
            });
            listEl.appendChild(li);
          }
        }
        document.getElementById('save-screen').addEventListener('click', async () => {
          if (!selectedId) return;
          const name = document.getElementById('screen-name').value || 'Untitled';
          const type = document.getElementById('screen-type').value;
          const width = Number(document.getElementById('screen-w').value || 0);
          const height = Number(document.getElementById('screen-h').value || 0);
          const enabled = document.getElementById('screen-enabled').checked;
          await fetch('${API_BASE}/screens/' + selectedId, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'x-api-key': 'test-api-key' },
            body: JSON.stringify({ name, type, resolution: { width, height }, enabled, order: 0 })
          });
          await load();
        });
        document.getElementById('delete-screen').addEventListener('click', async () => {
          if (!selectedId) return;
          await fetch('${API_BASE}/screens/' + selectedId, { method: 'DELETE', headers: { 'x-api-key': 'test-api-key' } });
          selectedId = null;
          document.getElementById('screen-preview').textContent = 'Select a screen.';
          await load();
        });
        await load();
      })();
    </script>
  `));
});

app.get('/library', async (_req, res) => {
  const projectRes = await fetch(`${API_BASE}/projects`);
  const projects = await projectRes.json();
  const projectId = projects[0]?.id || 'p1';
  const runsRes = await fetch(`${API_BASE}/api/pipeline/runs?projectId=${encodeURIComponent(projectId)}`, { headers: { 'x-api-key': 'test-api-key' } });
  const runs = await runsRes.json();
  res.send(layout('Library', `
    <section class="card">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <h2>Asset Pipeline</h2>
        <button id="run-pipeline" style="padding:8px 14px;">Run Pipeline</button>
      </div>
      <pre id="pipeline-status" class="muted" style="margin-top:12px;">Idle</pre>
      <pre id="pipeline-output" style="margin-top:12px;">${JSON.stringify(runs, null, 2)}</pre>
    </section>
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
      <div id="asset-preview" class="muted" style="margin-top:8px;">Select an asset.</div>
      <ul id="asset-list" style="list-style:none;padding:0;margin-top:12px;"></ul>
    </section>
    <script>
      (async () => {
        const listEl = document.getElementById('asset-list');
        const projectId = '${projectId}';
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
          loadAssets();
        });
        async function loadAssets() {
          const res = await fetch('${API_BASE}/assets?projectId=' + encodeURIComponent(projectId), { headers: { 'x-api-key': 'test-api-key' } });
          const assets = await res.json();
          listEl.innerHTML = '';
          const previewEl = document.getElementById('asset-preview');
          for (const asset of assets) {
            const li = document.createElement('li');
            li.className = 'card';
            li.innerHTML = '<strong>' + asset.name + '</strong> <span class="muted">' + asset.type + '</span>';
            li.style.cursor = 'pointer';
            li.addEventListener('click', () => {
              previewEl.innerHTML = '<strong>' + asset.name + '</strong><br><span class="muted">' + asset.type + '</span><br><code>' + asset.uri + '</code>';
            });
            listEl.appendChild(li);
          }
        }
        document.getElementById('run-pipeline').addEventListener('click', async () => {
          const statusEl = document.getElementById('pipeline-status');
          const outputEl = document.getElementById('pipeline-output');
          statusEl.textContent = 'Running...';
          try {
            const r = await fetch('${API_BASE}/api/pipeline/run', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'x-api-key': 'test-api-key' },
              body: JSON.stringify({ projectId: '${projectId}' })
            });
            const json = await r.json();
            outputEl.textContent = JSON.stringify(json, null, 2);
            statusEl.textContent = 'Completed ' + new Date().toLocaleTimeString();
          } catch (e) {
            statusEl.textContent = 'Error: ' + e.message;
          }
        });
        await loadAssets();
      })();
    </script>
  `));
});

app.get('/show-flow', async (_req, res) => {
  const response = await fetch(`${API_BASE}/projects`);
  const projects = await response.json();
  res.send(layout('Show Flow', `
    <section class="card">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <h2>Show Flow</h2>
        <span id="current-status" class="muted">Ready</span>
      </div>
      <div style="margin-top:12px;display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
        <input id="project-id" value="${projects[0]?.id ?? 'p1'}" style="padding:8px 12px;min-width:160px;" />
        <button id="reload" style="padding:8px 12px;">Reload</button>
        <button id="start" style="padding:8px 12px;">Start</button>
        <button id="stop" style="padding:8px 12px;">Stop</button>
        <button id="prev-scene" style="padding:8px 12px;">Previous</button>
        <button id="next-scene" style="padding:8px 12px;">Next</button>
      </div>
      <div id="preview-grid" style="position:relative;width:100%;background:#0b1220;border-radius:12px;overflow:hidden;border:1px solid #1f2937;margin-top:12px;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;padding:12px;"></div>
      <pre id="current-scene" class="muted" style="margin-top:12px;">No active scene.</pre>
      <ul id="scene-list" style="list-style:none;padding:0;margin-top:12px;"></ul>
      <ul id="cue-list" style="list-style:none;padding:0;margin-top:12px;"></ul>
    </section>
    <script>
      (async () => {
        const listEl = document.getElementById('scene-list');
        const cueListEl = document.getElementById('cue-list');
        const statusEl = document.getElementById('current-status');
        const currentEl = document.getElementById('current-scene');
        const projectEl = document.getElementById('project-id');
        const projects = ${JSON.stringify(projects)};
        const projectId = projects[0]?.id || 'p1';
        projectEl.value = projectId;
        let scenes = [];
        let activeSceneId = null;
        let cues = [];
        const previewEl = document.getElementById('preview-grid');
        const storageKey = 'showflow-active-' + projectId;
        async function loadRender() {
          if (!activeSceneId) {
            previewEl.innerHTML = '';
            return;
          }
          const projectId = projectEl.value.trim() || 'p1';
          const r = await fetch('${API_BASE}/api/render/scene/' + encodeURIComponent(activeSceneId) + '?projectId=' + encodeURIComponent(projectId), { headers: { 'x-api-key': 'test-api-key' } });
          const data = await r.json();
          previewEl.innerHTML = '';
          if (!data?.trees?.length) return;
          for (const tree of data.trees) {
            const wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            wrapper.style.aspectRatio = '16/9';
            wrapper.style.background = '#0b1220';
            wrapper.style.border = '1px solid #1f2937';
            wrapper.style.borderRadius = '12px';
            wrapper.style.overflow = 'hidden';
            const label = document.createElement('div');
            label.textContent = tree.screenId;
            label.style.position = 'absolute';
            label.style.top = '8px';
            label.style.left = '8px';
            label.style.background = 'rgba(0,0,0,0.5)';
            label.style.color = '#e5e7eb';
            label.style.padding = '4px 8px';
            label.style.borderRadius = '8px';
            label.style.fontSize = '12px';
            wrapper.appendChild(label);
            for (const object of tree.objects) {
              const el = document.createElement('div');
              el.textContent = object.assetId;
              el.style.position = 'absolute';
              el.style.left = object.x + 'px';
              el.style.top = object.y + 'px';
              el.style.width = object.width + 'px';
              el.style.height = object.height + 'px';
              el.style.background = '#2563eb';
              el.style.borderRadius = '12px';
              el.style.border = '1px solid #e5e7eb';
              el.style.color = '#fff';
              el.style.display = 'flex';
              el.style.alignItems = 'center';
              el.style.justifyContent = 'center';
              el.style.fontSize = '12px';
              el.style.opacity = object.visible ? object.opacity : '0';
              wrapper.appendChild(el);
            }
            previewEl.appendChild(wrapper);
          }
        }
        async function load() {
          const projectId = projectEl.value.trim() || 'p1';
          const [scenesRes, statusRes] = await Promise.all([
            fetch('${API_BASE}/scenes?projectId=' + encodeURIComponent(projectId), { headers: { 'x-api-key': 'test-api-key' } }),
            fetch('${API_BASE}/api/playback/status', { headers: { 'x-api-key': 'test-api-key' } })
          ]);
          scenes = await scenesRes.json();
          const status = await statusRes.json();
          statusEl.textContent = status.playing ? 'Playing' : 'Stopped';
          if (!activeSceneId && scenes.length) {
            activeSceneId = localStorage.getItem(storageKey) || scenes[0].id;
          } else if (activeSceneId && !scenes.find((s: any) => s.id === activeSceneId)) {
            activeSceneId = scenes[0]?.id || null;
          }
          listEl.innerHTML = '';
          cueListEl.innerHTML = '';
          const sceneCueMap = await Promise.all(scenes.map(async (scene: any) => {
            const cueRes = await fetch('${API_BASE}/cues?sceneId=' + encodeURIComponent(scene.id), { headers: { 'x-api-key': 'test-api-key' } });
            const cues = await cueRes.json();
            return { scene, cues };
          }));
          for (const entry of sceneCueMap) {
            const li = document.createElement('li');
            li.className = 'card';
            li.textContent = (activeSceneId === entry.scene.id ? '▶ ' : '') + entry.scene.name;
            li.style.cursor = 'pointer';
            li.addEventListener('click', async () => {
              activeSceneId = entry.scene.id;
              await activate(entry.scene.id);
            });
            listEl.appendChild(li);
            for (const cue of entry.cues) {
              const cueLi = document.createElement('li');
              cueLi.className = 'card';
              cueLi.textContent = 'Cue: ' + cue.name;
              cueLi.style.cursor = 'pointer';
              cueLi.addEventListener('click', async () => {
                await triggerCue(cue.id);
              });
              cueListEl.appendChild(cueLi);
            }
          }
          currentEl.textContent = activeSceneId ? ('Active: ' + (scenes.find((s: any) => s.id === activeSceneId)?.name ?? activeSceneId)) : 'No active scene.';
          await loadRender();
        }
        async function activate(id) {
          const projectId = projectEl.value.trim() || 'p1';
          activeSceneId = id;
          localStorage.setItem(storageKey, String(id));
          await fetch('${API_BASE}/scenes/' + encodeURIComponent(id) + '/activate?projectId=' + encodeURIComponent(projectId), {
            method: 'POST',
            headers: { 'x-api-key': 'test-api-key' }
          });
          statusEl.textContent = 'Active';
          await load();
        }
        async function triggerCue(id) {
          await fetch('${API_BASE}/api/playback/cues/' + encodeURIComponent(id) + '/trigger', { method: 'POST', headers: { 'x-api-key': 'test-api-key' } });
          await load();
        }
        document.getElementById('reload').addEventListener('click', load);
        document.getElementById('start').addEventListener('click', async () => {
          const projectId = projectEl.value.trim() || 'p1';
          await fetch('${API_BASE}/api/playback/start', { method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': 'test-api-key' }, body: JSON.stringify({ projectId }) });
          await load();
        });
        document.getElementById('stop').addEventListener('click', async () => {
          await fetch('${API_BASE}/api/playback/stop', { method: 'POST', headers: { 'x-api-key': 'test-api-key' } });
          await load();
        });
        const advanceMsInput = document.createElement('input');
        advanceMsInput.id = 'advance-ms';
        advanceMsInput.value = '3000';
        advanceMsInput.style.padding = '8px 12px';
        advanceMsInput.style.width = '90px';
        const advanceBtn = document.createElement('button');
        advanceBtn.id = 'advance';
        advanceBtn.textContent = 'Advance';
        advanceBtn.style.padding = '8px 12px';
        const stopAdvanceBtn = document.createElement('button');
        stopAdvanceBtn.id = 'stop-advance';
        stopAdvanceBtn.textContent = 'Stop Auto';
        stopAdvanceBtn.style.padding = '8px 12px';
        const controlsEl = document.getElementById('reload').parentElement;
        controlsEl.insertBefore(advanceMsInput, document.getElementById('reload').nextSibling);
        controlsEl.insertBefore(advanceBtn, document.getElementById('reload').nextSibling);
        controlsEl.insertBefore(stopAdvanceBtn, document.getElementById('reload').nextSibling);
        let advanceTimer = null;
        function scheduleAdvance() {
          if (advanceTimer) clearInterval(advanceTimer);
          const ms = Number(advanceMsInput.value) || 3000;
          advanceTimer = setInterval(async () => {
            try {
              await fetch('${API_BASE}/api/playback/advance', { method: 'POST', headers: { 'x-api-key': 'test-api-key' } });
              await load();
            } catch {}
          }, ms);
        }
        advanceBtn.addEventListener('click', async () => {
          await fetch('${API_BASE}/api/playback/start', { method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': 'test-api-key' }, body: JSON.stringify({ projectId: projectEl.value.trim() || 'p1' }) });
          scheduleAdvance();
          await load();
        });
        stopAdvanceBtn.addEventListener('click', async () => {
          if (advanceTimer) clearInterval(advanceTimer);
          advanceTimer = null;
          await fetch('${API_BASE}/api/playback/stop', { method: 'POST', headers: { 'x-api-key': 'test-api-key' } });
          await load();
        });
        document.getElementById('next-scene').addEventListener('click', async () => {
          if (!scenes.length) return;
          const idx = scenes.findIndex((s) => s.id === activeSceneId);
          const next = scenes[(idx + 1) % scenes.length];
          activeSceneId = next.id;
          await activate(next.id);
        });
        document.getElementById('prev-scene').addEventListener('click', async () => {
          if (!scenes.length) return;
          const idx = scenes.findIndex((s) => s.id === activeSceneId);
          const prev = scenes[(idx - 1 + scenes.length) % scenes.length];
          activeSceneId = prev.id;
          await activate(prev.id);
        });
        await load();
      })();
    </script>
  `));
});

app.get('/cues', async (_req, res) => {
  const response = await fetch(`${API_BASE}/projects`);
  const projects = await response.json();
  res.send(layout('Cues', `
    <section class="card">
      <h2>Cues</h2>
      <select id="cue-scene" style="padding:8px 12px;"></select>
      <button id="add-cue" style="padding:8px 12px;margin-left:8px;">Add Cue</button>
      <div id="cue-timeline" style="margin-top:12px;display:flex;gap:8px;overflow-x:auto;padding:8px;background:#0b1220;border-radius:12px;border:1px solid #1f2937;min-height:90px;align-items:center;"></div>
      <ul id="cue-list" style="list-style:none;padding:0;margin-top:12px;"></ul>
    </section>
    <script>
      (async () => {
        const listEl = document.getElementById('cue-list');
        const sceneEl = document.getElementById('cue-scene');
        const timelineEl = document.getElementById('cue-timeline');
        const projects = ${JSON.stringify(projects)};
        const projectId = projects[0]?.id;
        if (!projectId) {
          listEl.innerHTML = '<li class="muted">Create a project first.</li>';
          return;
        }
        const sceneRes = await fetch('${API_BASE}/scenes?projectId=' + encodeURIComponent(projectId), { headers: { 'x-api-key': 'test-api-key' } });
        const scenes = await sceneRes.json();
        sceneEl.innerHTML = scenes.map((s: any) => '<option value="' + s.id + '">' + s.name + '</option>').join('');
        async function load() {
          const res = await fetch('${API_BASE}/cues?sceneId=' + encodeURIComponent(sceneEl.value), { headers: { 'x-api-key': 'test-api-key' } });
          const cues = await res.json();
          listEl.innerHTML = '';
          timelineEl.innerHTML = '';
          for (const cue of cues.sort((a, b) => a.timelinePosition - b.timelinePosition)) {
            const li = document.createElement('li');
            li.className = 'card';
            li.draggable = true;
            li.dataset.id = cue.id;
            li.textContent = cue.name + ' (' + cue.timelinePosition + ')';
            li.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/plain', cue.id); });
            li.addEventListener('dragover', (e) => e.preventDefault());
            li.addEventListener('drop', async (e) => {
              const draggedId = e.dataTransfer.getData('text/plain');
              if (draggedId === cue.id) return;
              const all = await fetch('${API_BASE}/cues?sceneId=' + encodeURIComponent(sceneEl.value), { headers: { 'x-api-key': 'test-api-key' } }).then(r => r.json());
              const fromIdx = all.findIndex((c: any) => c.id === draggedId);
              const toIdx = all.findIndex((c: any) => c.id === cue.id);
              if (fromIdx < 0 || toIdx < 0) return;
              const moved = all.splice(fromIdx, 1)[0];
              all.splice(toIdx, 0, moved);
              for (let i = 0; i < all.length; i++) {
                await fetch('${API_BASE}/cues/' + encodeURIComponent(all[i].id) + '/reorder', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'x-api-key': 'test-api-key' },
                  body: JSON.stringify({ timelinePosition: i + 1 })
                });
              }
              load();
            });
            listEl.appendChild(li);

            const pill = document.createElement('div');
            pill.textContent = cue.name + ' #' + cue.timelinePosition;
            pill.style.cssText = 'padding:8px 12px;background:#1f2937;border:1px solid #e5e7eb;border-radius:10px;color:#e5e7eb;white-space:nowrap;cursor:pointer;';
            pill.addEventListener('click', async () => {
              await fetch('${API_BASE}/api/playback/cues/' + encodeURIComponent(cue.id) + '/trigger', { method: 'POST', headers: { 'x-api-key': 'test-api-key' } });
            });
            timelineEl.appendChild(pill);
          }
        }
        document.getElementById('add-cue').addEventListener('click', async () => {
          await fetch('${API_BASE}/cues', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': 'test-api-key' },
            body: JSON.stringify({ sceneId: sceneEl.value, name: 'Cue ' + (listEl.children.length + 1), timelinePosition: listEl.children.length + 1 })
          });
          load();
        });
        sceneEl.addEventListener('change', load);
        await load();
      })();
    </script>
  `));
});

app.get('/inspector', async (_req, res) => {
  const kind = (_req.query.kind as string) || '';
  const id = (_req.query.id as string) || '';
  res.send(layout('Inspector', `
    <section class="card">
      <h2>Inspector</h2>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
        <input id="inspector-kind" placeholder="kind: project/scene/asset/screen" value="${kind}" style="padding:8px 12px;" />
        <input id="inspector-id" placeholder="id" value="${id}" style="padding:8px 12px;" />
        <button id="inspect" style="padding:8px 12px;">Inspect</button>
      </div>
      <div id="inspector-panels" style="margin-top:12px;display:flex;flex-direction:column;gap:12px;"></div>
    </section>
    <script>
      (async () => {
        const kindEl = document.getElementById('inspector-kind');
        const idEl = document.getElementById('inspector-id');
        const panelsEl = document.getElementById('inspector-panels');
        async function run() {
          const kind = kindEl.value.trim();
          const id = idEl.value.trim();
          panelsEl.innerHTML = '';
          if (!kind || !id) {
            panelsEl.innerHTML = '<p class="muted">kind and id required</p>';
            return;
          }
          const base = '${API_BASE}';
          const headers = { 'x-api-key': 'test-api-key' };
          try {
            const summary = await fetch(base + '/inspector/' + encodeURIComponent(kind) + '/' + encodeURIComponent(id), { headers }).then(r => r.json());
            const summaryCard = document.createElement('div');
            summaryCard.className = 'card';
            summaryCard.innerHTML = '<h3>' + kind.charAt(0).toUpperCase() + kind.slice(1) + '</h3><pre style="margin-top:8px;">' + JSON.stringify(summary, null, 2) + '</pre>';
            panelsEl.appendChild(summaryCard);
            if (kind === 'project') {
              const projectId = summary.id || id;
              const [scenesRes, assetsRes, runsRes, statusRes] = await Promise.all([
                fetch(base + '/scenes?projectId=' + encodeURIComponent(projectId), { headers }),
                fetch(base + '/assets?projectId=' + encodeURIComponent(projectId), { headers }),
                fetch(base + '/api/pipeline/runs?projectId=' + encodeURIComponent(projectId), { headers }),
                fetch(base + '/api/playback/status', { headers })
              ]);
              const scenes = await scenesRes.json();
              const assets = await assetsRes.json();
              const runs = await runsRes.json();
              const status = await statusRes.json();
              const metaCard = document.createElement('div');
              metaCard.className = 'card';
              metaCard.innerHTML = '<h3>Project Resources</h3>' +
                '<p class="muted">Scenes: ' + (Array.isArray(scenes) ? scenes.length : 0) + '</p>' +
                '<p class="muted">Assets: ' + (Array.isArray(assets) ? assets.length : 0) + '</p>' +
                '<p class="muted">Playback: ' + (status.playing ? 'Playing' : 'Stopped') + '</p>';
              panelsEl.appendChild(metaCard);
              const pipelineCard = document.createElement('div');
              pipelineCard.className = 'card';
              pipelineCard.innerHTML = '<h3>Pipeline Runs</h3><pre style="margin-top:8px;">' + JSON.stringify(runs, null, 2) + '</pre>';
              panelsEl.appendChild(pipelineCard);
            }
            if (kind === 'scene') {
              const projectId = (summary.projectId as string) || 'p1';
              const renderRes = await fetch(base + '/api/render/scene/' + encodeURIComponent(id) + '?projectId=' + encodeURIComponent(projectId), { headers });
              const data = await renderRes.json();
              const card = document.createElement('div');
              card.className = 'card';
              const treeText = JSON.stringify(data, null, 2);
              card.innerHTML = '<h3>Render Tree</h3><pre style="margin-top:8px;">' + treeText + '</pre>';
              panelsEl.appendChild(card);
              if (data.trees?.length) {
                const wrapper = document.createElement('div');
                wrapper.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;margin-top:8px;';
                for (const tree of data.trees) {
                  const preview = document.createElement('div');
                  preview.style.cssText = 'background:#0b1220;border-radius:12px;border:1px solid #1f2937;padding:8px;';
                  preview.innerHTML = '<div style="color:#e5e7eb;font-size:12px;margin-bottom:6px;">' + tree.screenId + '</div>' + tree.objects.map((o: any) => '<div style="display:flex;align-items:center;gap:6px;margin-top:6px;"><div style="width:32px;height:32px;background:#2563eb;border:1px solid #e5e7eb;border-radius:8px;color:#fff;font-size:10px;display:flex;align-items:center;justify-content:center;">' + o.assetId + '</div><span style="color:#e2e8f0;font-size:12px;">' + Math.round(o.width) + 'x' + Math.round(o.height) + ' @ ' + Math.round(o.x) + ',' + Math.round(o.y) + '</span></div>').join('');
                  wrapper.appendChild(preview);
                }
                const vizCard = document.createElement('div');
                vizCard.className = 'card';
                vizCard.innerHTML = '<h3>Render Preview</h3>';
                vizCard.appendChild(wrapper);
                panelsEl.appendChild(vizCard);
              }
            }
          } catch (e) {
            panelsEl.innerHTML = '<pre>Error: ' + e.message + '</pre>';
          }
        }
        document.getElementById('inspect').addEventListener('click', run);
        if ('${kind}' && '${id}') await run();
      })();
    </script>
  `));
});



app.get('/works', async (_req, res) => {
  const response = await fetch(`${API_BASE}/api/works`);
  const data = await response.json();
  const items = (data ?? []) as Array<{ slug: string; title?: string }>;
  res.send(layout('Works', `
    <section class="card">
      <h2>Works</h2>
      <ul style="list-style:none;padding:0;">
        ${items.map((item) => `<li><a href="/works/${item.slug}">${item.title || item.slug}</a></li>`).join('')}
      </ul>
      <p class="muted">${items.length ? items.length + ' items' : 'No works yet.'}</p>
    </section>
  `));
});

app.get('/works/:slug', async (req, res) => {
  const response = await fetch(`${API_BASE}/api/works/${req.params.slug}`);
  if (!response.ok) return res.status(404).send(layout('Not found', '<p>Not found</p>'));
  const data = await response.json();
  res.send(layout(data.title ?? `Work ${req.params.slug}`, `
    <article class="card">
      <h2>${data.title ?? req.params.slug}</h2>
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
