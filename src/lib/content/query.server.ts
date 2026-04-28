import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { markdownToHtml } from './markdown';
import { blogPostFrontmatterSchema, type BlogPost, type BlogPostSummary } from './schema';

const BLOG_CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'blog');

export type TagCount = {
	tag: string;
	count: number;
};

export type CategoryCount = {
	category: string;
	slug: string;
	count: number;
};

export type ArchiveMonthGroup = {
	year: number;
	month: number;
	posts: BlogPostSummary[];
};

export type ArchiveYearGroup = {
	year: number;
	months: ArchiveMonthGroup[];
};

function slugFromFilename(filename: string): string {
	return filename.replace(/\.md$/, '');
}

function formatValidationError(filePath: string, error: unknown): Error {
	if (error instanceof Error) {
		return new Error(`Invalid frontmatter in ${filePath}: ${error.message}`);
	}

	return new Error(`Invalid frontmatter in ${filePath}`);
}

function sortPublicPosts(posts: BlogPost[]): BlogPost[] {
	return posts.toSorted((first, second) => {
		if (first.pin !== second.pin) {
			return first.pin ? -1 : 1;
		}

		return second.publishedAt.getTime() - first.publishedAt.getTime();
	});
}

function toSummary(post: BlogPost): BlogPostSummary {
	return {
		slug: post.slug,
		title: post.title,
		description: post.description,
		publishedAt: post.publishedAt,
		updatedAt: post.updatedAt,
		tags: post.tags,
		category: post.category,
		draft: post.draft,
		pin: post.pin
	};
}

function getPublicPostSummaries(posts: BlogPost[]): BlogPostSummary[] {
	return sortPublicPosts(posts.filter((post) => !post.draft)).map((post) => toSummary(post));
}

function sortCountEntries<T extends { count: number }>(
	entries: T[],
	getLabel: (entry: T) => string
): T[] {
	return entries.toSorted((first, second) => {
		if (first.count !== second.count) {
			return second.count - first.count;
		}

		return getLabel(first).localeCompare(getLabel(second));
	});
}

async function parsePostFile(filename: string): Promise<BlogPost> {
	const filePath = path.join(BLOG_CONTENT_DIR, filename);
	const source = await readFile(filePath, 'utf8');
	const parsed = matter(source);
	const frontmatterResult = blogPostFrontmatterSchema.safeParse(parsed.data);

	if (!frontmatterResult.success) {
		throw formatValidationError(filePath, frontmatterResult.error);
	}

	return {
		...frontmatterResult.data,
		slug: slugFromFilename(filename),
		html: await markdownToHtml(parsed.content)
	};
}

async function loadAllPosts(): Promise<BlogPost[]> {
	const filenames = await readdir(BLOG_CONTENT_DIR);
	const markdownFilenames = filenames.filter((filename) => filename.endsWith('.md')).toSorted();

	return Promise.all(markdownFilenames.map((filename) => parsePostFile(filename)));
}

export async function getPosts(): Promise<BlogPostSummary[]> {
	const posts = await loadAllPosts();

	return getPublicPostSummaries(posts);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
	const posts = await loadAllPosts();
	const post = posts.find((candidate) => candidate.slug === slug && !candidate.draft);

	return post ?? null;
}

export async function getTags(): Promise<TagCount[]> {
	const posts = await getPosts();
	const counts = new Map<string, number>();

	for (const post of posts) {
		for (const tag of post.tags) {
			counts.set(tag, (counts.get(tag) ?? 0) + 1);
		}
	}

	return sortCountEntries(
		Array.from(counts, ([tag, count]) => ({ tag, count })),
		(entry) => entry.tag
	);
}

export async function getPostsByTag(tag: string): Promise<BlogPostSummary[]> {
	const posts = await getPosts();

	return posts.filter((post) => post.tags.includes(tag));
}

export async function getCategories(): Promise<CategoryCount[]> {
	const posts = await getPosts();
	const categories = new Map<string, CategoryCount>();

	for (const post of posts) {
		const slug = encodeURIComponent(post.category);
		const current = categories.get(slug);

		categories.set(slug, {
			category: post.category,
			slug,
			count: (current?.count ?? 0) + 1
		});
	}

	return sortCountEntries(Array.from(categories.values()), (entry) => entry.category);
}

export async function getPostsByCategory(category: string): Promise<BlogPostSummary[]> {
	const posts = await getPosts();

	return posts.filter((post) => post.category === category);
}

export async function getArchiveGroups(): Promise<ArchiveYearGroup[]> {
	const posts = await getPosts();
	const years = new Map<number, Map<number, BlogPostSummary[]>>();

	for (const post of posts) {
		const year = post.publishedAt.getUTCFullYear();
		const month = post.publishedAt.getUTCMonth() + 1;
		const yearGroup = years.get(year) ?? new Map<number, BlogPostSummary[]>();
		const monthGroup = yearGroup.get(month) ?? [];

		monthGroup.push(post);
		yearGroup.set(month, monthGroup);
		years.set(year, yearGroup);
	}

	return Array.from(years, ([year, months]) => ({
		year,
		months: Array.from(months, ([month, postsInMonth]) => ({
			year,
			month,
			posts: postsInMonth
		})).toSorted((first, second) => second.month - first.month)
	})).toSorted((first, second) => second.year - first.year);
}
