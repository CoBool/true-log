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
	tags: z.array(trimmedString).optional(),
	image: imageSchema.optional(),
	pin: z.boolean().optional(),
	toc: z.boolean().optional()
}) satisfies z.ZodType<ParsedFrontmatter>;

export function parsePostFrontmatter(input: unknown): ParsedFrontmatter {
	return frontmatterSchema.parse(input);
}
