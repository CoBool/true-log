import type { TocLink } from '../markdown/types';

export interface ParsedFrontmatterImage {
	path: string;
	alt?: string;
}

export interface ParsedFrontmatter {
	title: string;
	date: string;
	description?: string;
	category?: string;
	tags?: string[];
	image?: ParsedFrontmatterImage;
	pin?: boolean;
	toc?: boolean;
}

export interface ParsedPost {
	slug: string;
	relativePath: string;
	frontmatter: ParsedFrontmatter;
	html: string;
	toc: TocLink[];
}

export interface PostListItem {
	slug: string;
	title: string;
	date: string;
	description?: string;
	category?: string;
	tags: string[];
	image?: ParsedFrontmatterImage;
	pin?: boolean;
	toc?: boolean;
}
