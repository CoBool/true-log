export interface TocLink {
	id: string;
	depth: number;
	text: string;
	children?: TocLink[];
}

export interface TocOptions {
	depth?: number;
	searchDepth?: number;
}

export interface ContentMeta {
	hasMath: boolean;
	hasMermaid: boolean;
	hasCodeBlock: boolean;
	codeLanguages: string[];
	readingTime: number;
	wordCount: number;
}

export interface ParseOptions {
	toc?: false | TocOptions;
	math?: boolean;
	mermaid?: boolean;
	theme?: {
		light?: string;
		dark?: string;
	};
}

export interface ParseResult {
	frontmatter: Record<string, unknown>;
	html: string;
	toc: TocLink[];
	meta: ContentMeta;
}
