import { describe, expect, it } from 'vitest';
import readingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';

import { detectContent } from './detector';

describe('detectContent', () => {
	it('uses markdown text extraction plus reading-time for mixed-language content', () => {
		const markdown = `
# 혼합 문서

한국어 문장과 English words가 함께 있습니다.

<div>HTML wrapper <strong>keeps text</strong></div>

\`\`\`ts
const hidden = 'code block text';
\`\`\`
`;

		const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown);
		const extractedText = toString(tree);
		const stats = readingTime(extractedText);

		const meta = detectContent(markdown);

		expect(meta.wordCount).toBe(stats.words);
		expect(meta.readingTime).toBe(Math.max(1, Math.ceil(stats.minutes)));
	});
});
