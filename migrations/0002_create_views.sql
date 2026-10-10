-- One row per (post, anonymous visitor): the count is unique readers, not page loads.
CREATE TABLE IF NOT EXISTS views (
  slug       TEXT    NOT NULL,
  visitor    TEXT    NOT NULL,
  first_seen INTEGER NOT NULL,
  PRIMARY KEY (slug, visitor)
);
