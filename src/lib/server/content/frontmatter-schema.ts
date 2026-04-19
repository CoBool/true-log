import { z } from 'zod';

import type { ParsedFrontmatter } from './types';

const trimmedString = z.string().trim().min(1);

const imageSchema = z.object({
	path: trimmedString,
	alt: trimmedString.optional()
});

export const frontmatterSchema = z.object({
	title: trimmedString,
	date: trimmedString,
	description: trimmedString.optional(),
	category: trimmedString.optional(),
	tags: z.array(trimmedString).default([]),
	image: imageSchema.optional(),
	pin: z.boolean().default(false),
	toc: z.boolean().default(true)
}) satisfies z.ZodType<ParsedFrontmatter>;

export function parsePostFrontmatter(input: unknown): ParsedFrontmatter {
	return frontmatterSchema.parse(input);
}
