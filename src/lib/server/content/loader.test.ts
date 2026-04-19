import { afterEach, describe, expect, it } from 'vitest';

import { mkdir, rm, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';

import { loadPostBySlug, loadPostSummaries, loadPosts } from './loader';

const postsDir = join(process.cwd(), 'content/posts');
const sampleSlug = 'content-engine-spike';
const laterPostPath = join(postsDir, '2099-01-02-later-post.md');
const mismatchedPostPath = join(postsDir, '2099-01-03-mismatch-post.md');
const duplicateEarlierPostPath = join(postsDir, '2099-01-03-duplicate-post.md');
const duplicateLaterPostPath = join(postsDir, '2099-01-04-duplicate-post.md');

async function writePost(
	path: string,
	frontmatterDate: string,
	body: string,
	title = basename(path).replace(/\.md$/, '')
): Promise<void> {
	await mkdir(postsDir, { recursive: true });
	await writeFile(path, `---\ntitle: '${title}'\ndate: ${frontmatterDate}\n---\n\n${body}\n`);
}

afterEach(async () => {
	await rm(laterPostPath, { force: true });
	await rm(mismatchedPostPath, { force: true });
	await rm(duplicateEarlierPostPath, { force: true });
	await rm(duplicateLaterPostPath, { force: true });
});

describe('loadPosts', () => {
	it('loads markdown posts and sorts them by published date descending', async () => {
		await mkdir(postsDir, { recursive: true });
		await writePost(laterPostPath, '2099-01-02', '## Later post\n\nA newer post.', '2099-01-02-later-post');

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

	it('rejects posts with duplicate slugs across different dates', async () => {
		await writePost(
			duplicateEarlierPostPath,
			'2099-01-03',
			'## Earlier duplicate\n\nThis should fail.',
			'Earlier duplicate'
		);
		await writePost(
			duplicateLaterPostPath,
			'2099-01-04',
			'## Later duplicate\n\nThis should also fail.',
			'Later duplicate'
		);

		await expect(loadPosts()).rejects.toThrow(/Duplicate post slug/);
	});
});

describe('loadPostBySlug', () => {
	it('loads a post by slug', async () => {
		const post = await loadPostBySlug(sampleSlug);

		expect(post).toMatchObject({
			slug: sampleSlug,
			publishedAt: '2026-04-19',
			frontmatter: {
				date: '2026-04-19',
				title: 'True Log Content Engine Spike'
			}
		});
		expect(post?.html).toContain('<h2');
	});

	it('returns null when the slug does not exist', async () => {
		await expect(loadPostBySlug('does-not-exist')).resolves.toBeNull();
	});

	it('rejects duplicate slugs instead of returning an arbitrary post', async () => {
		await writePost(
			duplicateEarlierPostPath,
			'2099-01-03',
			'## Earlier duplicate\n\nThis should fail.',
			'Earlier duplicate'
		);
		await writePost(
			duplicateLaterPostPath,
			'2099-01-04',
			'## Later duplicate\n\nThis should also fail.',
			'Later duplicate'
		);

		await expect(loadPostBySlug('duplicate-post')).rejects.toThrow(/Duplicate post slug/);
	});
});

describe('loadPostSummaries', () => {
	it('derives list item summaries from parsed posts', async () => {
		const summaries = await loadPostSummaries();
		const summary = summaries.find((item) => item.slug === sampleSlug);

		expect(summary).toMatchObject({
			slug: sampleSlug,
			title: 'True Log Content Engine Spike',
			description:
				'콘텐츠 엔진 스파이크에서 메타데이터, TOC, 렌더링 결과를 한 번에 검증하기 위한 샘플 포스트',
			publishedAt: '2026-04-19',
			category: 'Tech/SvelteKit',
			tags: ['SvelteKit', 'Tailwind CSS', 'shadcn-svelte', 'Markdown Pipeline'],
			image: {
				path: '/images/posts/content-engine-spike/cover.png',
				alt: '콘텐츠 엔진 스파이크 커버 이미지'
			},
			pin: true,
			readingTime: expect.any(Number)
		});
	});
});
