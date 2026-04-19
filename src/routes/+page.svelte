<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();
</script>

<svelte:head>
	<title>True Log</title>
</svelte:head>

<main class="mx-auto min-h-screen max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
	<section class="space-y-2">
		<p class="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Posts</p>
		<h1 class="text-3xl font-semibold tracking-tight text-slate-950">Root summaries</h1>
	</section>

	{#if data.summaries.length > 0}
		<ul class="mt-10 space-y-3">
			{#each data.summaries as post (post.slug)}
				<li class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
					<article class="space-y-3">
						<div class="flex flex-wrap items-start justify-between gap-3">
							<div class="min-w-0 space-y-2">
								<h2 class="text-lg font-semibold leading-snug text-slate-950">
									{post.title}
								</h2>

								{#if post.description}
									<p class="text-sm leading-6 text-slate-600">{post.description}</p>
								{/if}
							</div>

							{#if post.pin}
								<span class="inline-flex shrink-0 items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
									Pinned
								</span>
							{/if}
						</div>

						<div class="flex flex-wrap items-center gap-2 text-xs text-slate-500">
							<span>{post.publishedAt}</span>

							{#if post.category}
								<span class="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
									{post.category}
								</span>
							{/if}

							<span class="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
								{post.readingTime} min read
							</span>
						</div>

						{#if post.tags.length > 0}
							<div class="flex flex-wrap gap-2">
								{#each post.tags as tag}
									<span class="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-600">
										#{tag}
									</span>
								{/each}
							</div>
						{/if}
					</article>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="mt-10 text-sm text-slate-500">No summaries available.</p>
	{/if}
</main>
