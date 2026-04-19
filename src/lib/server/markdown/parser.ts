import { detectContent } from './detector';
import { parseFrontmatter } from './frontmatter';
import { createProcessor } from './pipeline';
import { generateToc } from './toc';
import type { ParseOptions, ParseResult } from './types';

export async function parseMarkdown(raw: string, options: ParseOptions = {}): Promise<ParseResult> {
	const { data: frontmatter, content } = parseFrontmatter(raw);
	const meta = detectContent(content);
	const processor = createProcessor();
	const vfile = await processor.process(content);
	const html = String(vfile);
	const tocDisabled = options.toc === false || frontmatter.toc === false;
	const toc = tocDisabled
		? []
		: generateToc(html, typeof options.toc === 'object' ? options.toc : undefined);

	return {
		frontmatter,
		html,
		toc,
		meta
	};
}
