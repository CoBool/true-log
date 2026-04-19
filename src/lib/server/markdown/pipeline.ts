import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeKatex from 'rehype-katex';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeStringify from 'rehype-stringify';
import { rehypeMermaid } from './plugins/rehype-mermaid';
import type { ParseOptions } from './types';
import type { LineElement } from 'rehype-pretty-code';

const DEFAULT_THEME = {
	light: 'github-light',
	dark: 'github-dark'
};

export async function createProcessor(options: ParseOptions = {}) {
	const theme = { ...DEFAULT_THEME, ...options.theme };
	const enableMath = options.math !== false;
	const enableMermaid = options.mermaid !== false;

	// unified 체인의 제네릭이 조건부 플러그인에서 쉽게 꼬여서, 원본 파서와 동일하게 느슨하게 둡니다.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let processor: any = unified().use(remarkParse).use(remarkGfm);

	if (enableMath) {
		processor = processor.use(remarkMath);
	}

	processor = processor.use(remarkRehype, { allowDangerousHtml: true }).use(rehypeRaw);

	if (enableMermaid) {
		processor = processor.use(rehypeMermaid);
	}

	processor = processor.use(rehypePrettyCode, {
		theme: {
			light: theme.light,
			dark: theme.dark
		},
		defaultLang: 'plaintext',
		keepBackground: false,
		onVisitLine(node: LineElement) {
			if (node.children.length === 0) {
				node.children = [{ type: 'text', value: ' ' }];
			}
		}
	});

	if (enableMath) {
		processor = processor.use(rehypeKatex);
	}

	processor = processor
		.use(rehypeSlug)
		.use(rehypeAutolinkHeadings, {
			behavior: 'wrap',
			properties: {
				className: ['heading-anchor']
			}
		})
		.use(rehypeExternalLinks, {
			target: '_blank',
			rel: ['noopener', 'noreferrer']
		})
		.use(rehypeStringify, {
			allowDangerousHtml: true
		});

	return processor;
}
