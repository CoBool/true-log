import { afterEach, describe, expect, it } from 'vitest';

import { mkdir, rm, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';

import { loadPosts } from './loader';

const postsDir = join(process.cwd(), 'content/posts');
const laterPostPath = join(postsDir, '2099-01-02-later-post.md');
const mismatchedPostPath = join(postsDir, '2099-01-03-mismatch-post.md');

async function writePost(path: string, frontmatterDate: string, body: string): Promise<void> {
	await mkdir(postsDir, { recursive: true });
	await writeFile(
		path,
		`---\ntitle: '${basename(path).replace(/\.md$/, '')}'\ndate: ${frontmatterDate}\n---\n\n${body}\n`
	);
}

afterEach(async () => {
	await rm(laterPostPath, { force: true });
	await rm(mismatchedPostPath, { force: true });
});

describe('loadPosts', () => {
	it('loads markdown posts and sorts them by published date descending', async () => {
		await writePost(laterPostPath, '2099-01-02', '## Later post\n\nA newer post.');

		const posts = await loadPosts();
		const contentEngineSpike = posts.find((post) => post.slug === 'content-engine-spike');

		expect(posts[0]?.slug).toBe('later-post');
		expect(posts[0]).toMatchObject({
			publishedAt: '2099-01-02',
			frontmatter: {
				date: '2099-01-02',
				title: '2099-01-02-later-post'
			}
		});
		expect(contentEngineSpike).toMatchObject({
			publishedAt: '2026-04-19',
			frontmatter: {
				date: '2026-04-19',
				title: 'True Log Content Engine Spike'
			}
		});
		expect(posts[0].html).toContain('<h2');
		expect(posts[0].toc).toHaveLength(1);
		expect(posts[0].meta).toMatchObject({
			wordCount: expect.any(Number),
			readingTime: expect.any(Number)
		});
	});

	it('rejects posts whose frontmatter date does not match the filename date', async () => {
		await writePost(mismatchedPostPath, '2099-01-04', '## Broken post\n\nThis should fail.');

		await expect(loadPosts()).rejects.toThrow();
	});
});
