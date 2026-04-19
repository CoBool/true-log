import type { ContentMeta, TocLink } from '../markdown/types';

export interface ParsedFrontmatter {
	title: string;
	date: string;
	description?: string;
	category?: string;
	tags: string[];
	image?: {
		path: string;
		alt?: string;
	};
	pin: boolean;
	toc: boolean;
}

export interface ParsedPost {
	slug: string;
	relativePath: string;
	sourcePath: string;
	publishedAt: string;
	frontmatter: ParsedFrontmatter;
	html: string;
	toc: TocLink[];
	meta: ContentMeta;
}

export interface PostListItem {
	slug: string;
	title: string;
	description?: string;
	publishedAt: string;
	category?: string;
	tags: string[];
	image?: {
		path: string;
		alt?: string;
	};
	pin: boolean;
	readingTime: number;
}
