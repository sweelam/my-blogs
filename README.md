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
3. After that, `make release` handles everything.

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
