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
		expect(result.html).toContain('--shiki-light:');
		expect(result.html).toContain('data-theme="github-light github-dark"');
	});

	it('renders block math with katex markup', async () => {
		const result = await parseMarkdown(`
$$
E = mc^2
$$
`);

		expect(result.html).toContain('class="katex"');
		expect(result.html).toContain('E');
	});

	it('converts mermaid code blocks into mermaid pre blocks', async () => {
		const result = await parseMarkdown(`
\`\`\`mermaid
graph TD
  A[Source] --> B[Parser]
\`\`\`
`);

		expect(result.html).toContain('<pre class="mermaid">');
		expect(result.html).toContain('graph TD');
		expect(result.html).not.toContain('data-language="mermaid"');
	});
});
