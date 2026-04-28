import { error } from '@sveltejs/kit';
import { getPostBySlug, getPostNavigation, getPosts } from '$lib/content/index.server';

import type { EntryGenerator, PageServerLoad } from './$types';
import type { BlogPostSummary } from '$lib/content/index.server';

export const entries: EntryGenerator = async () => {
	const posts = await getPosts();

	return posts.map((post) => ({
		slug: post.slug
	}));
};

function toNavigationPost(post: BlogPostSummary | null) {
	if (!post) {
		return null;
	}

	return {
		slug: post.slug,
		title: post.title,
		description: post.description,
		publishedAt: post.publishedAt
	};
}

export const load: PageServerLoad = async ({ params }) => {
	if (!params.slug) {
		throw error(404, 'Post not found');
	}

	const post = await getPostBySlug(params.slug);

	if (!post) {
		throw error(404, 'Post not found');
	}

	const navigation = await getPostNavigation(post.slug);

	return {
		post: {
			slug: post.slug,
			title: post.title,
			description: post.description,
			publishedAt: post.publishedAt,
			updatedAt: post.updatedAt,
			tags: post.tags,
			readingTime: post.readingTime,
			toc: post.toc,
			html: post.html
		},
		navigation: {
			previous: toNavigationPost(navigation.previous),
			next: toNavigationPost(navigation.next)
		}
	};
};
