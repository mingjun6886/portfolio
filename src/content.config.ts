import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { TAG_ORDER } from './lib/projects.js';

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '*.md' }),
  schema: z
    .object({
      title: z.string(),
      summary: z.string(),
      course: z.string().optional(),
      team_size: z.number().int().min(1).default(1),
      role: z.string().optional(),
      period: z.string(),
      tags: z.array(z.enum(TAG_ORDER as [string, ...string[]])).min(1),
      stack: z.array(z.string()).default([]),
      metrics: z.array(z.object({ value: z.string(), label: z.string() })).max(3).default([]),
      links: z
        .object({ demo: z.string().url().optional(), github: z.string().url().optional(), diagram: z.string().url().optional() })
        .default({}),
      code_public: z.boolean().default(true),
      cover: z.string().optional(),
      featured: z.boolean().default(false),
      order: z.number().default(100),
    })
    .refine((d) => d.team_size === 1 || !!d.role, 'team projects need a role'),
});

export const collections = { projects };
