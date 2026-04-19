import { z } from 'zod';

import type { ContentFrontmatter } from './types';

const imageSchema = z.object({
	path: z.string().min(1),
	alt: z.string().min(1)
});

export const frontmatterSchema = z
	.object({
		title: z.string().min(1),
		date: z.coerce.date(),
		description: z.string().min(1),
		category: z.string().min(1),
		tags: z.array(z.string().min(1)).default([]),
		image: imageSchema.optional(),
		pin: z.boolean().default(false),
		toc: z.boolean().default(true)
	}) satisfies z.ZodType<ContentFrontmatter>;
