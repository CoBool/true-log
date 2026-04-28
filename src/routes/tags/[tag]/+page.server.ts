import { getPostsByTag } from '$lib/content/index.server';

import type { PageServerLoad } from './$types';

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
