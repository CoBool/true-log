import { getTags } from '$lib/content/index.server';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		tags: await getTags()
	};
};
