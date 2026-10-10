.PHONY: dev dev-full build check test preview clean deploy release db-create db-migrate-local db-migrate db-stats

PROJECT_NAME ?= my-blogs

## ── Dev ─────────────────────────────────────────────────────────────────────
dev:
	npm run dev

preview: build
	npm run preview

# Static site + Pages Functions (reactions API) + local D1, at http://localhost:8788
dev-full: build db-migrate-local
	npx wrangler pages dev

## ── Test ────────────────────────────────────────────────────────────────────
check:
	npx astro check
	npx tsc -p functions

build:
	npm run build

test: check build
	@echo "✓ All checks passed"

## ── Release ─────────────────────────────────────────────────────────────────
# Deploy a preview (branch deploy, not promoted to production)
deploy: build
	npx wrangler pages deploy dist --project-name=$(PROJECT_NAME)

# Full release: test → build → promote to production
release: test
	npx wrangler pages deploy dist --project-name=$(PROJECT_NAME) --branch=main

## ── Database (D1, reactions) ────────────────────────────────────────────────
DB_NAME ?= my-blogs-reactions

# One-time: create the D1 database, then paste the printed database_id into wrangler.toml
db-create:
	npx wrangler d1 create $(DB_NAME)

db-migrate-local:
	npx wrangler d1 migrations apply $(DB_NAME) --local

db-migrate:
	npx wrangler d1 migrations apply $(DB_NAME) --remote

# Per-post readers / likes / dislikes from the production database
db-stats:
	npx wrangler d1 execute $(DB_NAME) --remote --command "\
	  SELECT slug, \
	    (SELECT COUNT(*) FROM views v WHERE v.slug = s.slug) AS readers, \
	    (SELECT COUNT(*) FROM reactions r WHERE r.slug = s.slug AND r.reaction = 'like') AS likes, \
	    (SELECT COUNT(*) FROM reactions r WHERE r.slug = s.slug AND r.reaction = 'dislike') AS dislikes \
	  FROM (SELECT slug FROM views UNION SELECT slug FROM reactions) s ORDER BY readers DESC"

## ── Housekeeping ─────────────────────────────────────────────────────────────
clean:
	rm -rf dist .astro

install:
	npm install
