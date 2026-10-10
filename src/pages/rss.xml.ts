import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE, getSortedPosts } from '../lib/posts';

export async function GET(context: APIContext) {
  const posts = await getSortedPosts();
  return rss({
    title: SITE.author,
    description: SITE.description,
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.slug}/`,
    })),
    customData: '<language>en</language>',
  });
}
