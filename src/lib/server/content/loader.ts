import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

import { parseMarkdown } from '../markdown';
import { parsePostFrontmatter } from './frontmatter-schema';
import { parsePostSlug } from './slug';
import type { ParsedPost } from './types';

const postsDir = join(process.cwd(), 'content/posts');

export async function loadPosts(): Promise<ParsedPost[]> {
	const filenames = (await readdir(postsDir))
		.filter((filename) => filename.endsWith('.md'))
		.sort();

	const posts = await Promise.all(filenames.map(loadPost));

	return posts.sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));
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

function normalizeFrontmatterDate(date: unknown): unknown {
	if (date instanceof Date) {
		return date.toISOString().slice(0, 10);
	}

	return date;
}
