import matter from 'gray-matter';

export interface FrontmatterResult {
	data: Record<string, unknown>;
	content: string;
}

export function parseFrontmatter(raw: string): FrontmatterResult {
	const { data, content } = matter(raw);

	return { data, content };
}
