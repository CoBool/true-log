import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

export async function markdownToHtml(markdown: string): Promise<string> {
	// Current content is authored by trusted repository contributors. If external authoring is added,
	// introduce an HTML sanitization step before returning rendered output.
	const file = await unified()
		.use(remarkParse)
		.use(remarkRehype)
		.use(rehypeStringify)
		.process(markdown);

	return String(file);
}
