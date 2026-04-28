import { getCategories, getPostsByCategory } from '$lib/content/index.server';

import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = async () => {
	const categories = await getCategories();

	return categories.map((category) => ({
		category: category.category
	}));
};

export const load: PageServerLoad = async ({ params }) => {
	const category = params.category;
	const posts = await getPostsByCategory(category);

	return {
		category,
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
