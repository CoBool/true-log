import { getPostsByCategoryPath } from '$lib/content/index.server';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const categoryPath = params.category.split('/');
	const posts = await getPostsByCategoryPath(categoryPath);

	return {
		categoryPath,
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
