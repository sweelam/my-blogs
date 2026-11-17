import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    cover: z.string().optional(),
    tags: z.array(z.string()).optional(),
    lang: z.enum(['en', 'ar']).optional().default('en'),
    // Guest author; omit for posts written by the site owner.
    author: z
      .object({
        name: z.string(),
        role: z.string().optional(),
        bio: z.string().optional(),
        avatar: z.string().optional(),
        links: z
          .object({
            website: z.string().url().optional(),
            linkedin: z.string().url().optional(),
            github: z.string().url().optional(),
            youtube: z.string().url().optional(),
          })
          .optional(),
      })
      .optional(),
  }),
});

export const collections = { blog };
