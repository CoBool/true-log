import { getPostsByTag, getTags } from '$lib/content/index.server';

import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = async () => {
	const tags = await getTags();

	return tags.map((tag) => ({
		tag: tag.tag
	}));
};

export const load: PageServerLoad = async ({ params }) => {
	const posts = await getPostsByTag(params.tag);

	return {
		tag: params.tag,
		posts: posts.map((post) => ({
			slug: post.slug,
			title: post.title,
			description: post.description,
			publishedAt: post.publishedAt,
			tags: post.tags,
			pin: post.pin
		}))
	};
};
