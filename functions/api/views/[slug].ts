// POST /api/views/:slug → { views }
// Records the current visitor as a reader of the post (once) and returns the unique reader count.

import { type Env, ensureVisitor, isValidSlug, json, postExists } from '../../_lib/http';

export const onRequestPost: PagesFunction<Env, 'slug'> = async ({ request, env, params }) => {
  const slug = String(params.slug);
  if (!isValidSlug(slug)) return json({ error: 'invalid slug' }, 400);
  if (!(await postExists(env, request, slug))) return json({ error: 'unknown post' }, 404);

  const { visitor, headers } = ensureVisitor(request);
  const [, count] = await env.DB.batch<{ views: number }>([
    env.DB.prepare('INSERT OR IGNORE INTO views (slug, visitor, first_seen) VALUES (?1, ?2, ?3)').bind(
      slug,
      visitor,
      Date.now(),
    ),
    env.DB.prepare('SELECT COUNT(*) AS views FROM views WHERE slug = ?1').bind(slug),
  ]);

  return json({ views: count.results[0]?.views ?? 0 }, 200, headers);
};
