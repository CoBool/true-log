export interface ContentImage {
	path: string;
	alt: string;
}

export interface ContentFrontmatter {
	title: string;
	date: Date;
	description: string;
	category: string;
	tags: string[];
	image?: ContentImage;
	pin: boolean;
	toc: boolean;
}
