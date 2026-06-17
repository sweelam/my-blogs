.PHONY: dev build check test preview clean deploy release

PROJECT_NAME ?= my-blogs

## ── Dev ─────────────────────────────────────────────────────────────────────
dev:
	npm run dev

preview: build
	npm run preview

## ── Test ────────────────────────────────────────────────────────────────────
check:
	npx astro check

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

## ── Housekeeping ─────────────────────────────────────────────────────────────
clean:
	rm -rf dist .astro

install:
	npm install
