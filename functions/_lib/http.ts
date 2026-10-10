// Shared helpers for the Pages Functions under /api.

export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
}

const SLUG_RE = /^[a-z0-9-]{1,120}$/;
const ONE_YEAR = 60 * 60 * 24 * 365;

export function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...headers },
  });
}

export function isValidSlug(slug: string) {
  return SLUG_RE.test(slug);
}

// Only accept writes for posts that exist in the built site (see src/pages/blog/slugs.json.ts).
// Probing the post URL isn't enough: without a 404 page, Pages answers unknown paths with index.html.
export async function postExists(env: Env, request: Request, slug: string) {
  const res = await env.ASSETS.fetch(new URL('/blog/slugs.json', request.url));
  if (!res.ok) return false;
  const slugs = (await res.json()) as string[];
  return slugs.includes(slug);
}

// Visitors are anonymous: a random id in an HttpOnly cookie, shared by all /api endpoints.
export function readVisitor(request: Request): string | null {
  const cookie = request.headers.get('cookie') ?? '';
  const match = cookie.match(/(?:^|;\s*)vid=([0-9a-f-]{36})(?:;|$)/);
  return match ? match[1] : null;
}

export function ensureVisitor(request: Request): { visitor: string; headers: Record<string, string> } {
  const existing = readVisitor(request);
  if (existing) return { visitor: existing, headers: {} };
  const visitor = crypto.randomUUID();
  return {
    visitor,
    headers: { 'set-cookie': `vid=${visitor}; Path=/api; Max-Age=${ONE_YEAR}; HttpOnly; Secure; SameSite=Lax` },
  };
}
