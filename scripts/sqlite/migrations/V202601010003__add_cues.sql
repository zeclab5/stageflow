-- Cue table
CREATE TABLE IF NOT EXISTS cues (
  id TEXT PRIMARY KEY,
  scene_id TEXT NOT NULL,
  name TEXT NOT NULL,
  timeline_position REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
);

-- Seed demo cues
INSERT OR REPLACE INTO cues (id, scene_id, name, timeline_position, status)
VALUES ('c1', 's1', 'Intro', 1, 'pending');
