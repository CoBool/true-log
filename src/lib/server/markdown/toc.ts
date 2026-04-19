import type { TocLink, TocOptions } from './types';

const DEFAULT_TOC_OPTIONS: Required<TocOptions> = {
	depth: 2,
	searchDepth: 2
};

export function generateToc(html: string, options?: TocOptions): TocLink[] {
	const depth =
		options?.depth !== undefined ? Math.min(options.depth, 2) : DEFAULT_TOC_OPTIONS.depth;
	const maxLevel = depth + 1;
	const headingRegex = new RegExp(`<h([2-${maxLevel}])\\s+id="([^"]*)"[^>]*>(.*?)</h\\1>`, 'gs');
	const headers: TocLink[] = [];
	let match: RegExpExecArray | null;

	while ((match = headingRegex.exec(html)) !== null) {
		headers.push({
			id: match[2],
			depth: Number.parseInt(match[1], 10),
			text: match[3].replace(/<[^>]*>/g, '').trim()
		});
	}

	return nestHeaders(headers);
}

function nestHeaders(headers: TocLink[]): TocLink[] {
	if (headers.length <= 1) {
		return headers;
	}

	const toc: TocLink[] = [];
	let parent: TocLink | undefined;

	for (const header of headers) {
		if (!parent || header.depth <= parent.depth) {
			header.children = [];
			parent = header;
			toc.push(header);
		} else {
			parent.children = parent.children || [];
			parent.children.push(header);
		}
	}

	for (const header of toc) {
		if (header.children && header.children.length > 0) {
			header.children = nestHeaders(header.children);
		} else {
			delete header.children;
		}
	}

	return toc;
}
