import { describe, expect, it } from 'vitest';

import { parsePostFrontmatter } from './frontmatter-schema';

describe('parsePostFrontmatter', () => {
	it('parses the minimum valid frontmatter shape', () => {
		expect(
			parsePostFrontmatter({
				title: '  True Log Content Engine Spike  ',
				date: ' 2026-04-19 '
			})
		).toEqual({
			title: 'True Log Content Engine Spike',
			date: '2026-04-19'
		});
	});

	it('rejects frontmatter without a required title', () => {
		expect(() =>
			parsePostFrontmatter({
				date: '2026-04-19'
			})
		).toThrow();
	});

	it('rejects invalid tags entries', () => {
		expect(() =>
			parsePostFrontmatter({
				title: 'True Log Content Engine Spike',
				date: '2026-04-19',
				tags: ['SvelteKit', '   ']
			})
		).toThrow();
	});
});
