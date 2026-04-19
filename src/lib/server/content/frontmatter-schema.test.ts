import { describe, expect, it } from 'vitest';

import { frontmatterSchema } from './frontmatter-schema';

describe('frontmatterSchema', () => {
	it('accepts valid content frontmatter', () => {
		const result = frontmatterSchema.safeParse({
			title: 'True Log Content Engine Spike',
			date: new Date('2026-04-19'),
			description: '콘텐츠 엔진 스파이크에서 메타데이터, TOC, 렌더링 결과를 한 번에 검증하기 위한 샘플 포스트',
			category: 'Tech/SvelteKit',
			tags: ['SvelteKit', 'Tailwind CSS', 'shadcn-svelte'],
			image: {
				path: '/images/posts/content-engine-spike/cover.png',
				alt: '콘텐츠 엔진 스파이크 커버 이미지'
			},
			pin: true,
			toc: true
		});

		expect(result.success).toBe(true);
		expect(result.success && result.data.date).toEqual(new Date('2026-04-19'));
	});
});
