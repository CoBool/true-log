import { z } from 'zod';

const dateStringSchema = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected date in YYYY-MM-DD format')
	.transform((value, context) => {
		const date = new Date(`${value}T00:00:00.000Z`);

		if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
			context.addIssue({
				code: 'custom',
				message: 'Expected a valid calendar date in YYYY-MM-DD format'
			});

			return z.NEVER;
		}

		return date;
	});

export const blogPostFrontmatterSchema = z.object({
	title: z.string().trim().min(1),
	description: z.string().trim().min(1),
	publishedAt: dateStringSchema,
	updatedAt: dateStringSchema.optional(),
	tags: z.array(z.string().trim().min(1)).min(1),
	category: z
		.string()
		.trim()
		.min(1)
		.refine((value) => !value.includes('/'), 'Category cannot include /'),
	draft: z.boolean(),
	pin: z.boolean().default(false)
});

export const contentPageFrontmatterSchema = z.object({
	title: z.string().trim().min(1),
	description: z.string().trim().min(1)
});

export type BlogPostFrontmatter = z.infer<typeof blogPostFrontmatterSchema>;
export type ContentPageFrontmatter = z.infer<typeof contentPageFrontmatterSchema>;

export type TableOfContentsItem = {
	id: string;
	text: string;
	depth: 2 | 3;
};

export type ReadingTime = {
	minutes: number;
	text: string;
};

export type BlogPost = BlogPostFrontmatter & {
	slug: string;
	html: string;
	toc: TableOfContentsItem[];
	readingTime: ReadingTime;
};

export type BlogPostSummary = Omit<BlogPost, 'html' | 'toc'>;

export type ContentPage = ContentPageFrontmatter & {
	slug: string;
	html: string;
};
