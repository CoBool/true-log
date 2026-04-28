import { getCategories } from '$lib/content/index.server';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		categories: await getCategories()
	};
};
