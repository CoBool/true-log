import { describe, expect, it } from 'vitest';

import { parseMarkdown } from './parser';

describe('parseMarkdown', () => {
	it('applies syntax highlighting to fenced code blocks', async () => {
		const result = await parseMarkdown(`
\`\`\`ts
const greeting = 'hello';
\`\`\`
`);

		expect(result.html).toContain('data-language="ts"');
		expect(result.html).toContain('style="color:');
	});
});
