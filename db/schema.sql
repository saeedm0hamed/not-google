-- Enable pg_trgm for wildcard support
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Table: documents
CREATE TABLE IF NOT EXISTS documents (
  id          BIGSERIAL PRIMARY KEY,
  url         TEXT UNIQUE NOT NULL,
  title       TEXT,
  raw_html    TEXT,
  plain_text  TEXT,
  language    TEXT DEFAULT 'en',
  image_url   TEXT,
  crawled_at  TIMESTAMPTZ DEFAULT NOW(),
  indexed     BOOLEAN DEFAULT FALSE
);

-- Table: inverted_index
CREATE TABLE IF NOT EXISTS inverted_index (
  id        BIGSERIAL PRIMARY KEY,
  term      TEXT NOT NULL,
  doc_id    BIGINT REFERENCES documents(id) ON DELETE CASCADE,
  frequency INTEGER NOT NULL DEFAULT 1,
  positions INTEGER[] NOT NULL DEFAULT '{}',
  tf        FLOAT8,
  UNIQUE (term, doc_id)
);

-- Fast lookup by term
CREATE INDEX IF NOT EXISTS idx_inverted_term ON inverted_index (term);
-- Wildcard support with trigram index
CREATE INDEX IF NOT EXISTS idx_inverted_term_trgm ON inverted_index USING gin (term gin_trgm_ops);

-- Table: term_stats
CREATE TABLE IF NOT EXISTS term_stats (
  term      TEXT PRIMARY KEY,
  doc_freq  INTEGER NOT NULL DEFAULT 1,
  idf       FLOAT8
);
