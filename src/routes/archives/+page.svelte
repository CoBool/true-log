<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function formatMonth(year: number, month: number): string {
		return new Intl.DateTimeFormat('en', {
			month: 'long',
			year: 'numeric',
			timeZone: 'UTC'
		}).format(new Date(Date.UTC(year, month - 1)));
	}

	function formatDate(date: Date): string {
		return new Intl.DateTimeFormat('en', {
			dateStyle: 'medium'
		}).format(date);
	}
</script>

<svelte:head>
	<title>Archives | true_log</title>
	<meta name="description" content="Browse true_log posts by publish date" />
</svelte:head>

<main class="mx-auto w-full max-w-4xl px-4 py-12 text-gray-800">
	<section class="mb-8" aria-labelledby="archives-title">
		<p class="mb-2 text-sm font-bold text-indigo-600 uppercase">Archives</p>
		<h1 id="archives-title" class="text-4xl leading-tight font-bold text-gray-950 sm:text-5xl">
			Archives
		</h1>
	</section>

	{#if data.archiveGroups.length > 0}
		<div class="grid gap-8">
			{#each data.archiveGroups as yearGroup (yearGroup.year)}
				<section aria-labelledby={`archive-${yearGroup.year}`}>
					<h2 id={`archive-${yearGroup.year}`} class="mb-4 text-2xl font-bold text-gray-950">
						{yearGroup.year}
					</h2>

					<div class="grid gap-5">
						{#each yearGroup.months as monthGroup (`${monthGroup.year}-${monthGroup.month}`)}
							<section class="rounded-lg border border-gray-300 bg-white p-5">
								<h3 class="mb-4 text-lg font-bold text-gray-900">
									{formatMonth(monthGroup.year, monthGroup.month)}
								</h3>

								<ul class="m-0 grid list-none gap-3 p-0">
									{#each monthGroup.posts as post (post.slug)}
										<li>
											<a
												class="flex flex-wrap items-baseline justify-between gap-2 text-inherit no-underline hover:text-indigo-600 focus-visible:text-indigo-600 focus-visible:outline-none"
												href={resolve('/blog/[slug]', { slug: post.slug })}
											>
												<span class="font-semibold">{post.title}</span>
												<time
													class="text-sm text-gray-500"
													datetime={post.publishedAt.toISOString()}
												>
													{formatDate(post.publishedAt)}
												</time>
											</a>
										</li>
									{/each}
								</ul>
							</section>
						{/each}
					</div>
				</section>
			{/each}
		</div>
	{:else}
		<p class="leading-relaxed text-gray-500">No public archives yet.</p>
	{/if}
</main>
