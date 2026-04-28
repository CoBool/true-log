import { unified } from 'unified';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

import type { ReadingTime, TableOfContentsItem } from './schema';

const WORDS_PER_MINUTE = 200;

type HastNode = Record<string, unknown>;

export type RenderedMarkdown = {
	html: string;
	toc: TableOfContentsItem[];
	readingTime: ReadingTime;
};

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

function isTocHeading(node: { tagName?: unknown }): boolean {
	return node.tagName === 'h2' || node.tagName === 'h3';
}

function getChildren(node: HastNode): HastNode[] {
	return Array.isArray(node.children) ? node.children.filter(isRecord) : [];
}

function getTextContent(node: HastNode): string {
	if (node.type === 'text' && typeof node.value === 'string') {
		return node.value;
	}

	return getChildren(node).map(getTextContent).join('');
}

function visitElements(node: HastNode, callback: (element: HastNode) => void): void {
	if (node.type === 'element') {
		callback(node);
	}

	for (const child of getChildren(node)) {
		visitElements(child, callback);
	}
}

function collectTableOfContents(toc: TableOfContentsItem[]) {
	return (tree: unknown): undefined => {
		if (!isRecord(tree)) {
			return;
		}

		visitElements(tree, (node) => {
			if (!isTocHeading(node)) {
				return;
			}

			const properties = isRecord(node.properties) ? node.properties : {};
			const id = properties.id;
			const text = getTextContent(node).trim();

			if (typeof id !== 'string' || !text) {
				return;
			}

			toc.push({
				id,
				text,
				depth: node.tagName === 'h2' ? 2 : 3
			});
		});
	};
}

export function calculateReadingTime(markdown: string): ReadingTime {
	const readableText = markdown
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/`[^`]*`/g, ' ')
		.replace(/<[^>]*>/g, ' ')
		.replace(/[#>*_[\]()`~!-]/g, ' ');
	const words = readableText.match(/[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)?|[\u3131-\uD79D]/g) ?? [];
	const minutes = Math.max(1, Math.ceil(words.length / WORDS_PER_MINUTE));

	return {
		minutes,
		text: `${minutes} min read`
	};
}

export async function renderMarkdown(markdown: string): Promise<RenderedMarkdown> {
	const toc: TableOfContentsItem[] = [];

	// Current content is authored by trusted repository contributors. If external authoring is added,
	// introduce an HTML sanitization step before returning rendered output.
	const file = await unified()
		.use(remarkParse)
		.use(remarkRehype)
		.use(rehypePrettyCode, {
			theme: 'github-dark-dimmed',
			keepBackground: false
		})
		.use(rehypeSlug)
		.use(() => collectTableOfContents(toc))
		.use(rehypeAutolinkHeadings, {
			behavior: 'append',
			test: isTocHeading,
			properties: {
				ariaLabel: 'Link to heading',
				className: ['heading-anchor']
			},
			content: {
				type: 'text',
				value: '#'
			}
		})
		.use(rehypeStringify)
		.process(markdown);

	return {
		html: String(file),
		toc,
		readingTime: calculateReadingTime(markdown)
	};
}
