# my-blogs

Personal blog built with [Astro](https://astro.build) and deployed to [Cloudflare Pages](https://pages.cloudflare.com).

## Prerequisites

- Node.js 18+
- A Cloudflare account with a Pages project named `my-blogs`
- Wrangler authenticated: `npx wrangler login`

## Setup

```bash
make install
```

## Local Development

Start a live-reloading dev server at `http://localhost:4321`:

```bash
make dev
```

To preview the production build locally before deploying:

```bash
make preview
```

## Testing

Runs TypeScript / Astro type checks and a production build to catch any errors:

```bash
make test
```

Individual steps:

| Command | What it does |
|---------|-------------|
| `make check` | Astro type-check (`astro check`) |
| `make build` | Production build into `dist/` |

## Releasing to Cloudflare Pages

### Preview deploy (non-production)

Builds and deploys to a preview URL — safe to share but not yet promoted to production:

```bash
make deploy
```

### Production release

Runs the full test suite, then deploys the `main` branch to production:

```bash
make release
```

> Wrangler will print the live URL after a successful deploy.

### First-time Cloudflare setup

1. Log in to Wrangler once:
   ```bash
   npx wrangler login
   ```
2. Create the Pages project (only needed once):
   ```bash
   npx wrangler pages project create my-blogs
   ```
3. Create the reactions/readers database and apply its schema (only needed once):
   ```bash
   make db-create      # then paste the printed database_id into wrangler.toml
   make db-migrate
   ```
4. After that, `make release` handles everything. Run `make db-migrate` again whenever a new file lands in `migrations/`.

## Reader Interactions (likes, readers, share)

Each post shows a unique-reader count next to its date and, at the end, 👍/👎 buttons plus share links (LinkedIn, X, copy link).

- **API** — Cloudflare Pages Functions in `functions/api/`:
  - `GET|PUT /api/reactions/:slug` — like/dislike counts; `PUT { "reaction": "like" | "dislike" | null }`
  - `POST /api/views/:slug` — records the reader once and returns `{ views }`
- **Storage** — Cloudflare D1 (`DB` binding in `wrangler.toml`), schema in `migrations/`.
- **Identity** — anonymous: a random id in an HttpOnly `vid` cookie, so one reaction and one view per browser per post.
- `make dev` (Astro only) has no API, so the counts and buttons stay hidden there. To test them locally:
  ```bash
  make dev-full   # build + local D1 + Functions at http://localhost:8788
  ```
- To see production numbers per post:
  ```bash
  make db-stats
  ```

## Writing a New Blog Post

### 1. Create the file

Add a new Markdown file under `src/content/blog/`. Use lowercase words separated by hyphens as the filename — it becomes the URL slug:

```
src/content/blog/my-new-post.md
```

### 2. Add frontmatter

Every post must start with this frontmatter block:

```markdown
---
title: "Your Post Title"
date: 2026-06-17
description: "A short one- or two-sentence summary shown in the post listing."
cover: "/images/blog/your-cover-image.png"
---

Your post content starts here...
```

| Field | Required | Notes |
|-------|----------|-------|
| `title` | Yes | Displayed as the page heading |
| `date` | Yes | Format: `YYYY-MM-DD` |
| `description` | Yes | Shown on the home page listing |
| `cover` | No | Path relative to `public/` |

### 3. Add a cover image (optional)

Drop the image into `public/images/blog/` and reference it in `cover`:

```
public/images/blog/my-new-post.png
```

### 4. Preview locally

```bash
make dev
```

Open `http://localhost:4321` and navigate to your post to verify it looks right.

### 5. Publish

```bash
make release
```

---

## Housekeeping

```bash
make clean   # delete dist/ and .astro/ cache
```
