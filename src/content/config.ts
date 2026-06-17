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
  }),
});

export const collections = { blog };
