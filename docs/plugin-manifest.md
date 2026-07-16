# Plugin Manifest

Plugin metadata lives in each plugin package under:
- Package descriptor: `package.json`
- Plugin section: `stageflowPlugin`
- Default entry: `src/index.ts`

`stageflowPlugin` schema:

- `entry` — main entry path. Relative to the plugin package root.
- `module` — module file.
- `types` — type declarations path.
- `category` — plugin category. One of `integration`, `generation`, `storage`, `ui`.

Runtime discovery:
- Plugin loader scans `plugins/` and reads `stageflowPlugin` fields.
- Plugin-to-Plugin imports should go through `pluginRegistry` instead of direct workspace imports.

Plugin definition checklist:
- add `stageflowPlugin` to `package.json`
- export `PluginDescriptor` from `src/index.ts`
- register in `apps/api/src/container.ts`

Documentation:
- add usage notes to this file
- do not create separate `PluginManifest.md`