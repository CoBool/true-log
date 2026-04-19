import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeStringify from 'rehype-stringify';

export function createProcessor() {
	return unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypeRaw)
		.use(rehypeSlug)
		.use(rehypePrettyCode, {
			theme: 'github-dark-default',
			keepBackground: false,
			defaultLang: {
				block: 'plaintext',
				inline: 'plaintext'
			},
			onVisitLine(node) {
				if (node.children.length === 0) {
					node.children = [{ type: 'text', value: ' ' }];
				}
			}
		})
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
}
