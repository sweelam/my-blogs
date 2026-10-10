import { getCollection } from 'astro:content';

// Build-time list of post slugs, used by the /api Functions to reject unknown posts.
export async function GET() {
  const posts = await getCollection('blog');
  return new Response(JSON.stringify(posts.map((post) => post.slug)), {
    headers: { 'content-type': 'application/json' },
  });
}
