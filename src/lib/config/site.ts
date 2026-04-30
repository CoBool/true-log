export const site = {
	name: 'true_log',
	description:
		'A SvelteKit Markdown blog template inspired by Chirpy, built for technical writing.',
	navItems: [
		{ href: '/', label: 'Home' },
		{ href: '/posts', label: 'Posts' },
		{ href: '/categories', label: 'Categories' },
		{ href: '/tags', label: 'Tags' },
		{ href: '/about', label: 'About' }
	]
} as const;
