import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;
export type Lang = 'en' | 'ar';

export const SITE = {
  author: 'Mohammed Sweelam',
  description:
    'Software engineer and author writing about distributed systems, architecture, programming languages, and the human side of engineering.',
  links: {
    website: 'https://msweelam.dev/',
    linkedin: 'https://www.linkedin.com/in/mohamedsweelam/',
    github: 'https://github.com/sweelam',
  },
};

/** All posts, newest first. */
export async function getSortedPosts(): Promise<Post[]> {
  return (await getCollection('blog')).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Estimated reading time in whole minutes (~230 wpm), ignoring code, images and markup. */
export function readingTime(body: string): number {
  const text = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_`~\-[\]()]/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}

export function formatDate(date: Date, lang: Lang = 'en', month: 'short' | 'long' = 'short'): string {
  return date.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month, day: 'numeric' });
}

export function readingLabel(minutes: number, lang: Lang = 'en'): string {
  return lang === 'ar'
    ? `${new Intl.NumberFormat('ar-EG').format(minutes)} دقائق قراءة`
    : `${minutes} min read`;
}
