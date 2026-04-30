<script lang="ts">
	import { resolve } from '$app/paths';
	import favicon from '$lib/assets/favicon.svg';
	import { site } from '$lib/config/site';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen bg-gray-50 text-gray-900">
	<header class="border-b border-gray-200 bg-white">
		<nav
			class="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-5 gap-y-3 px-4 py-4"
			aria-label="Global navigation"
		>
			<a class="text-lg font-bold text-gray-950 no-underline" href={resolve('/')}>{site.name}</a>

			<ul
				class="m-0 flex list-none flex-wrap gap-x-4 gap-y-2 p-0 text-sm font-semibold text-gray-600"
			>
				{#each site.navItems as item (item.href)}
					<li>
						<a
							class="no-underline hover:text-indigo-600 focus-visible:text-indigo-600"
							href={resolve(item.href)}
						>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</header>

	{@render children()}
</div>
