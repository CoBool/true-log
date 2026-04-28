import { getArchiveGroups } from '$lib/content/index.server';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const archiveGroups = await getArchiveGroups();

	return {
		archiveGroups: archiveGroups.map((yearGroup) => ({
			year: yearGroup.year,
			months: yearGroup.months.map((monthGroup) => ({
				year: monthGroup.year,
				month: monthGroup.month,
				posts: monthGroup.posts.map((post) => ({
					slug: post.slug,
					title: post.title,
					description: post.description,
					publishedAt: post.publishedAt,
					tags: post.tags,
					pin: post.pin
				}))
			}))
		}))
	};
};
