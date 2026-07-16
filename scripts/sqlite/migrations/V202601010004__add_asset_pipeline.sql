CREATE TABLE IF NOT EXISTS asset_pipeline_runs (
  id TEXT PRIMARY KEY,
  asset_id TEXT NOT NULL,
  project_id TEXT NOT NULL,
  source_uri TEXT NOT NULL,
  kind TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued',
  current_stage TEXT NOT NULL DEFAULT 'detect',
  attempts INTEGER NOT NULL DEFAULT 0,
  metadata TEXT NOT NULL DEFAULT '{}',
  thumbnail_uri TEXT NOT NULL DEFAULT '',
  cache_uri TEXT NOT NULL DEFAULT '',
  indexed INTEGER NOT NULL DEFAULT 0,
  error TEXT NOT NULL DEFAULT '',
  occurred_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_asset_pipeline_runs_project ON asset_pipeline_runs(project_id);
CREATE INDEX IF NOT EXISTS idx_asset_pipeline_runs_status ON asset_pipeline_runs(status);
