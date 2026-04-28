<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Categories | true_log</title>
	<meta name="description" content="Browse true_log posts by category" />
</svelte:head>

<main class="mx-auto w-full max-w-4xl px-4 py-12 text-gray-800">
	<section class="mb-8" aria-labelledby="categories-title">
		<p class="mb-2 text-sm font-bold text-indigo-600 uppercase">Categories</p>
		<h1 id="categories-title" class="text-4xl leading-tight font-bold text-gray-950 sm:text-5xl">
			Browse categories
		</h1>
	</section>

	{#if data.categories.length > 0}
		<ul class="m-0 grid list-none gap-3 p-0" aria-label="Categories">
			{#each data.categories as category (category.slug)}
				<li>
					<a
						class="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white p-4 text-inherit no-underline hover:border-indigo-600 focus-visible:border-indigo-600 focus-visible:outline-none"
						href={resolve('/categories/[category]', { category: category.slug })}
					>
						<span class="font-semibold text-gray-900">{category.category}</span>
						<span class="text-sm text-gray-500">{category.count} posts</span>
					</a>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="leading-relaxed text-gray-500">No public categories yet.</p>
	{/if}
</main>
