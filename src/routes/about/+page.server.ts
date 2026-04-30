import { error } from '@sveltejs/kit';
import { getContentPageBySlug } from '$lib/content/index.server';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const page = await getContentPageBySlug('about');

	if (!page) {
		throw error(404, 'Page not found');
	}

	return {
		page
	};
};
