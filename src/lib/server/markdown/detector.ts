import type { ContentMeta } from './types';
import readingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';

const BLOCK_MATH_REGEX = /\$\$[\s\S]+?\$\$/;
const INLINE_MATH_REGEX = /(?<!\w)\$(?!\s)([^\n$]+?)(?<!\s)\$(?!\w)/;
const MERMAID_REGEX = /^```mermaid\s*$/m;

export function detectContent(markdown: string): ContentMeta {
	const codeLanguages = extractCodeLanguages(markdown);

	return {
		hasMath: BLOCK_MATH_REGEX.test(markdown) || INLINE_MATH_REGEX.test(markdown),
		hasMermaid: MERMAID_REGEX.test(markdown),
		hasCodeBlock: codeLanguages.length > 0,
		codeLanguages,
		readingTime: calculateReadingTime(markdown),
		wordCount: countWords(markdown)
	};
}

function extractCodeLanguages(markdown: string): string[] {
	const languages = new Set<string>();
	const regex = /^```(\w+)/gm;
	let match: RegExpExecArray | null;

	while ((match = regex.exec(markdown)) !== null) {
		const language = match[1].toLowerCase();

		if (language !== 'mermaid') {
			languages.add(language);
		}
	}

	return Array.from(languages).sort();
}

function calculateReadingTime(markdown: string): number {
	const stats = getReadingStats(markdown);

	return Math.max(1, Math.ceil(stats.minutes));
}

function countWords(markdown: string): number {
	return getReadingStats(markdown).words;
}

function getReadingStats(markdown: string) {
	const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown);
	const extractedText = toString(tree);

	return readingTime(extractedText);
}
