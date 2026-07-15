import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const API_BASE = process.env.API_BASE || 'http://localhost:3101';

app.use(express.static('public'));

app.get('/', (_req, res) => {
  res.send(`
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>StageFlow</title>
    <style>
      body { font-family: sans-serif; margin: 0; padding: 24px; }
      header { display: flex; align-items: center; justify-content: space-between; }
      nav a { margin-right: 12px; text-decoration: none; color: #111827; }
      .card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; margin-top: 16px; }
      .muted { color: #6b7280; }
      a { color: #2563eb; }
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
    <main>
      <section class="card">
        <h2>Welcome</h2>
        <p class="muted">Plugin-first stage production platform.</p>
      </section>
    </main>
  </body>
</html>
  `);
});

app.use('/api/plugins', createProxyMiddleware({ target: `${API_BASE}/plugins`, changeOrigin: true }));
app.use('/api/works', createProxyMiddleware({ target: `${API_BASE}/works`, changeOrigin: true }));
app.use('/api/blog', createProxyMiddleware({ target: `${API_BASE}/blog`, changeOrigin: true }));

app.use((_req, res) => res.status(404).send('Not found'));

app.listen(PORT, () => console.log(`Web listening on http://localhost:${PORT}`));
