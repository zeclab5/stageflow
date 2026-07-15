import express from 'express';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

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
      nav a { margin-right: 12px; }
      .card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; margin-top: 16px; }
      .muted { color: #6b7280; }
    </style>
  </head>
  <body>
    <header>
      <h1>StageFlow</h1>
      <nav>
        <a href="/">Home</a>
        <a href="/works">Works</a>
        <a href="/blog">Blog</a>
        <a href="/plugins">Plugins</a>
      </nav>
    </header>
    <main>
      <section class="card">
        <h2>Welcome</h2>
        <p class="muted">Plugin-first stage production platform.</p>
      </section>
      <section class="card">
        <h2>Plugins</h2>
        <pre id="plugins">connect API to load plugin list</pre>
      </section>
    </main>
  </body>
</html>
  `);
});

app.listen(PORT, () => console.log(`Web listening on http://localhost:${PORT}`));
