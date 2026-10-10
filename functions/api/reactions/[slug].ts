// GET /api/reactions/:slug  → { likes, dislikes, mine }
// PUT /api/reactions/:slug  body { reaction: 'like' | 'dislike' | null } → same shape
//
// Each anonymous visitor holds at most one reaction per post, which they can switch or remove.

import { type Env, ensureVisitor, isValidSlug, json, postExists, readVisitor } from '../../_lib/http';

type Reaction = 'like' | 'dislike';

interface Counts {
  likes: number;
  dislikes: number;
  mine: Reaction | null;
}

async function getCounts(db: D1Database, slug: string, visitor: string | null): Promise<Counts> {
  const row = await db
    .prepare(
      `SELECT
         COALESCE(SUM(reaction = 'like'), 0)    AS likes,
         COALESCE(SUM(reaction = 'dislike'), 0) AS dislikes,
         MAX(CASE WHEN visitor = ?2 THEN reaction END) AS mine
       FROM reactions WHERE slug = ?1`,
    )
    .bind(slug, visitor ?? '')
    .first<Counts>();
  return { likes: row?.likes ?? 0, dislikes: row?.dislikes ?? 0, mine: row?.mine ?? null };
}

export const onRequestGet: PagesFunction<Env, 'slug'> = async ({ request, env, params }) => {
  const slug = String(params.slug);
  if (!isValidSlug(slug)) return json({ error: 'invalid slug' }, 400);
  return json(await getCounts(env.DB, slug, readVisitor(request)));
};

export const onRequestPut: PagesFunction<Env, 'slug'> = async ({ request, env, params }) => {
  const slug = String(params.slug);
  if (!isValidSlug(slug)) return json({ error: 'invalid slug' }, 400);

  // Requiring JSON forces a CORS preflight for cross-site callers, which we never approve.
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return json({ error: 'expected application/json' }, 415);
  }

  let reaction: unknown;
  try {
    ({ reaction } = (await request.json()) as { reaction?: unknown });
  } catch {
    return json({ error: 'invalid body' }, 400);
  }
  if (reaction !== 'like' && reaction !== 'dislike' && reaction !== null) {
    return json({ error: 'reaction must be "like", "dislike" or null' }, 400);
  }

  if (!(await postExists(env, request, slug))) return json({ error: 'unknown post' }, 404);

  const { visitor, headers } = ensureVisitor(request);
  if (reaction === null) {
    await env.DB.prepare('DELETE FROM reactions WHERE slug = ?1 AND visitor = ?2')
      .bind(slug, visitor)
      .run();
  } else {
    await env.DB.prepare(
      `INSERT INTO reactions (slug, visitor, reaction, updated_at) VALUES (?1, ?2, ?3, ?4)
       ON CONFLICT (slug, visitor) DO UPDATE SET reaction = excluded.reaction, updated_at = excluded.updated_at`,
    )
      .bind(slug, visitor, reaction, Date.now())
      .run();
  }

  return json(await getCounts(env.DB, slug, visitor), 200, headers);
};
