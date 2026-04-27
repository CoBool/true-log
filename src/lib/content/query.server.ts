import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { markdownToHtml } from './markdown';
import { blogPostFrontmatterSchema, type BlogPost, type BlogPostSummary } from './schema';

const BLOG_CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'blog');

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
		categories: post.categories,
		draft: post.draft,
		pin: post.pin
	};
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

	return sortPublicPosts(posts.filter((post) => !post.draft)).map((post) => toSummary(post));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
	const posts = await loadAllPosts();
	const post = posts.find((candidate) => candidate.slug === slug && !candidate.draft);

	return post ?? null;
}
