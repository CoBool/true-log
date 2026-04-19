const POST_FILENAME_REGEX = /^(\d{4}-\d{2}-\d{2})-(.+)\.md$/;

export function parsePostSlug(filename: string): { publishedAt: string; slug: string } {
	const match = POST_FILENAME_REGEX.exec(filename);

	if (!match) {
		throw new Error(`Invalid post filename: ${filename}`);
	}

	return {
		publishedAt: match[1],
		slug: match[2]
	};
}
