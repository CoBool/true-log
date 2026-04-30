import { getPosts } from '$lib/content/index.server';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const posts = await getPosts();

	return {
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
