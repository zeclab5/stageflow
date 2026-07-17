# Plugin Scaffold

Use `plugins/_template` as a starter for new plugin packages. Current built-in plugins:
- `plugins/resolume`

Create a plugin:
```bash
cp -R plugins/_template plugins/<name>
```

Then edit:
- `plugins/<name>/package.json`
  - `name`: `@stageflow/<name>`
  - `description`: one-line description
  - `stageflowPlugin.entry`: runtime entry path
- `plugins/<name>/src/index.ts`
  - export plugin class and descriptor
- `plugins/<name>/tsconfig.json`
  - set `outDir` and `rootDir`

Runtime discovery scans `plugins/` and registers plugins from `stageflowPlugin` metadata. Activate via `/api/plugins/:name/activate` or rely on bootstrap auto-discovery when `dist/index.js` exists.
