<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function formatDate(date: Date): string {
		return new Intl.DateTimeFormat('en', {
			dateStyle: 'medium'
		}).format(date);
	}
</script>

<svelte:head>
	<title>{data.category} | true_log</title>
	<meta name="description" content={`Posts in ${data.category}`} />
</svelte:head>

<main class="mx-auto w-full max-w-4xl px-4 py-12 text-gray-800">
	<a
		class="mb-8 inline-flex font-bold text-indigo-600 no-underline hover:underline"
		href={resolve('/categories')}
	>
		Back to categories
	</a>

	<section class="mb-8" aria-labelledby="category-title">
		<p class="mb-2 text-sm font-bold text-indigo-600 uppercase">Category</p>
		<h1 id="category-title" class="text-4xl leading-tight font-bold text-gray-950 sm:text-5xl">
			{data.category}
		</h1>
	</section>

	{#if data.posts.length > 0}
		<ul class="m-0 grid list-none gap-4 p-0" aria-label={`Posts in ${data.category}`}>
			{#each data.posts as post (post.slug)}
				<li>
					<a
						class="block rounded-lg border border-gray-300 bg-white p-5 text-inherit no-underline transition-colors hover:border-indigo-600 focus-visible:border-indigo-600 focus-visible:outline-none"
						href={resolve('/blog/[slug]', { slug: post.slug })}
					>
						<div class="mb-3 flex flex-wrap gap-2 text-sm text-gray-500">
							<time datetime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt)}</time>
							{#if post.pin}
								<span class="font-bold text-indigo-600">Featured</span>
							{/if}
						</div>
						<h2 class="mb-2 text-2xl leading-snug font-bold">{post.title}</h2>
						<p class="leading-relaxed text-gray-600">{post.description}</p>
					</a>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="leading-relaxed text-gray-500">No public posts for this category yet.</p>
	{/if}
</main>
