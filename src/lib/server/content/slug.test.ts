import { describe, expect, it } from 'vitest';

import { parsePostSlug } from './slug';

describe('parsePostSlug', () => {
	it('parses a post filename into publishedAt and slug', () => {
		expect(parsePostSlug('2026-04-19-true-log-content-engine-spike.md')).toEqual({
			publishedAt: '2026-04-19',
			slug: 'true-log-content-engine-spike'
		});
	});
});
