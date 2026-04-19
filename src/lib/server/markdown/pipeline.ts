import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeStringify from 'rehype-stringify';

export function createProcessor() {
	return unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypeRaw)
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
}
