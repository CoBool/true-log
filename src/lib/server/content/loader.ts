import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

import { parseMarkdown } from '../markdown';
import { parsePostFrontmatter } from './frontmatter-schema';
import { parsePostSlug } from './slug';
import type { ParsedPost, PostListItem } from './types';

const postsDir = join(process.cwd(), 'content/posts');

export async function loadPosts(): Promise<ParsedPost[]> {
	const filenames = await listPostFilenames();

	const posts = await Promise.all(filenames.map(loadPost));

	return posts.sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));
}

export async function loadPostBySlug(slug: string): Promise<ParsedPost | null> {
	const filenames = await listPostFilenames();
	const matches = filenames.filter((candidate) => parsePostSlug(candidate).slug === slug);

	if (matches.length === 0) {
		return null;
	}

	if (matches.length > 1) {
		throw new Error(`Duplicate post slug detected: ${slug}`);
	}

	return loadPost(matches[0]);
}

export async function loadPostSummaries(): Promise<PostListItem[]> {
	const posts = await loadPosts();

	return posts.map(toPostListItem);
}

async function loadPost(filename: string): Promise<ParsedPost> {
	const { publishedAt, slug } = parsePostSlug(filename);
	const sourcePath = join(postsDir, filename);
	const raw = await readFile(sourcePath, 'utf8');
	const parsed = await parseMarkdown(raw);
	const frontmatter = parsePostFrontmatter({
		...parsed.frontmatter,
		date: normalizeFrontmatterDate(parsed.frontmatter.date)
	});

	if (frontmatter.date !== publishedAt) {
		throw new Error(
			`Post date mismatch for ${filename}: filename date ${publishedAt} does not match frontmatter date ${frontmatter.date}`
		);
	}

	return {
		slug,
		relativePath: relative(process.cwd(), sourcePath),
		sourcePath,
		publishedAt,
		frontmatter,
		html: parsed.html,
		toc: parsed.toc,
		meta: parsed.meta
	};
}

function toPostListItem(post: ParsedPost): PostListItem {
	const {
		frontmatter: { category, description, image, pin, tags, title },
		meta: { readingTime },
		publishedAt,
		slug
	} = post;

	return {
		slug,
		title,
		description,
		publishedAt,
		category,
		tags,
		image,
		pin,
		readingTime
	};
}

function normalizeFrontmatterDate(date: unknown): unknown {
	if (date instanceof Date) {
		return date.toISOString().slice(0, 10);
	}

	return date;
}

async function listPostFilenames(): Promise<string[]> {
	const filenames = (await readdir(postsDir))
		.filter((filename) => filename.endsWith('.md'))
		.sort();

	assertUniqueSlugs(filenames);

	return filenames;
}

function assertUniqueSlugs(filenames: string[]): void {
	const slugToFilename = new Map<string, string>();

	for (const filename of filenames) {
		const { slug } = parsePostSlug(filename);
		const existingFilename = slugToFilename.get(slug);

		if (existingFilename) {
			throw new Error(
				`Duplicate post slug detected: ${slug} (${existingFilename}, ${filename})`
			);
		}

		slugToFilename.set(slug, filename);
	}
}
