<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { site } from '$lib/config/site';

	function normalizePath(pathname: string): string {
		const normalized = pathname.replace(/\/$/, '');

		return normalized || '/';
	}

	function isActive(href: (typeof site.navItems)[number]['href']): boolean {
		const currentPath = normalizePath(page.url.pathname);
		const targetPath = normalizePath(resolve(href));

		if (targetPath === '/') {
			return currentPath === '/';
		}

		return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
	}
</script>

<nav aria-label="Global navigation">
	<ul class="m-0 flex list-none flex-wrap gap-2 p-0 sm:grid">
		{#each site.navItems as item (item.href)}
			{@const active = isActive(item.href)}
			<li>
				<a
					class={[
						'flex min-h-11 items-center rounded-md px-3 py-2 text-sm font-semibold no-underline outline-none transition-colors focus-visible:ring-2 focus-visible:ring-indigo-300',
						active
							? 'bg-indigo-600 text-white'
							: 'text-gray-300 hover:bg-gray-900 hover:text-white focus-visible:bg-gray-900 focus-visible:text-white'
					]}
					href={resolve(item.href)}
					aria-current={active ? 'location' : undefined}
				>
					{item.label}
				</a>
			</li>
		{/each}
	</ul>
</nav>
