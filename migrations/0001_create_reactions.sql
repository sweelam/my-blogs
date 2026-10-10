-- One row per (post, anonymous visitor). Counts are derived, so they can never drift.
CREATE TABLE IF NOT EXISTS reactions (
  slug       TEXT    NOT NULL,
  visitor    TEXT    NOT NULL,
  reaction   TEXT    NOT NULL CHECK (reaction IN ('like', 'dislike')),
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (slug, visitor)
);
