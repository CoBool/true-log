import { error } from '@sveltejs/kit';
import { getPostBySlug } from '$lib/content/index.server';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	if (!params.slug) {
		throw error(404, 'Post not found');
	}

	const post = await getPostBySlug(params.slug);

	if (!post) {
		throw error(404, 'Post not found');
	}

	return {
		post: {
			slug: post.slug,
			title: post.title,
			description: post.description,
			publishedAt: post.publishedAt,
			updatedAt: post.updatedAt,
			tags: post.tags,
			html: post.html
		}
	};
};
