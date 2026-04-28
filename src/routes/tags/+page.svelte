<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Tags | true_log</title>
	<meta name="description" content="Browse true_log posts by tag" />
</svelte:head>

<main class="mx-auto w-full max-w-4xl px-4 py-12 text-gray-800">
	<section class="mb-8" aria-labelledby="tags-title">
		<p class="mb-2 text-sm font-bold text-indigo-600 uppercase">Tags</p>
		<h1 id="tags-title" class="text-4xl leading-tight font-bold text-gray-950 sm:text-5xl">
			Browse tags
		</h1>
	</section>

	{#if data.tags.length > 0}
		<ul class="m-0 flex list-none flex-wrap gap-3 p-0" aria-label="Tags">
			{#each data.tags as tag (tag.tag)}
				<li>
					<a
						class="inline-flex rounded-full border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 no-underline hover:border-indigo-600 hover:text-indigo-600 focus-visible:border-indigo-600 focus-visible:text-indigo-600 focus-visible:outline-none"
						href={resolve('/tags/[tag]', { tag: tag.tag })}
					>
						{tag.tag}
						<span class="ml-2 text-gray-500">{tag.count}</span>
					</a>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="leading-relaxed text-gray-500">No public tags yet.</p>
	{/if}
</main>
