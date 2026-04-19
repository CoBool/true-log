<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();

	const formatDate = (value: string) =>
		new Intl.DateTimeFormat('ko-KR', {
			dateStyle: 'long',
			timeZone: 'Asia/Seoul'
		}).format(new Date(`${value}T00:00:00+09:00`));
</script>

<svelte:head>
	<title>{data.post.frontmatter.title} | True Log</title>
	{#if data.post.frontmatter.description}
		<meta name="description" content={data.post.frontmatter.description} />
	{/if}
</svelte:head>

<main class="mx-auto min-h-screen max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
	<div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
		<article class="space-y-8">
			<header class="space-y-4 border-b border-slate-200 pb-6">
				<p class="text-xs font-medium tracking-[0.2em] text-slate-500 uppercase">Post detail</p>
				<div class="space-y-3">
					<h1 class="text-4xl font-semibold tracking-tight text-slate-950">
						{data.post.frontmatter.title}
					</h1>

					{#if data.post.frontmatter.description}
						<p class="max-w-2xl text-lg leading-8 text-slate-600">
							{data.post.frontmatter.description}
						</p>
					{/if}
				</div>

				<div class="flex flex-wrap items-center gap-2 text-sm text-slate-600">
					<span class="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
						{formatDate(data.post.publishedAt)}
					</span>

					<span class="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
						{data.post.meta.readingTime} min read
					</span>

					<span class="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
						{data.post.meta.wordCount} words
					</span>

					{#if data.post.frontmatter.category}
						<span class="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
							{data.post.frontmatter.category}
						</span>
					{/if}
				</div>
			</header>

			<section class="space-y-4">
				<div class="flex flex-wrap gap-2">
					<span class="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600">
						Math: {data.post.meta.hasMath ? 'yes' : 'no'}
					</span>
					<span class="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600">
						Mermaid: {data.post.meta.hasMermaid ? 'yes' : 'no'}
					</span>
					<span class="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600">
						Code: {data.post.meta.hasCodeBlock ? 'yes' : 'no'}
					</span>
				</div>

				{#if data.post.frontmatter.tags.length > 0}
					<div class="flex flex-wrap gap-2">
						{#each data.post.frontmatter.tags as tag (tag)}
							<span class="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
								#{tag}
							</span>
						{/each}
					</div>
				{/if}
			</section>

			<section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
				<div class="prose max-w-none prose-slate prose-headings:scroll-mt-24 prose-a:text-sky-700">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html data.post.html}
				</div>
			</section>
		</article>

		<aside class="space-y-4 lg:sticky lg:top-8 lg:self-start">
			<div class="rounded-3xl border border-slate-200 bg-slate-50 p-5">
				<p class="text-xs font-medium tracking-[0.2em] text-slate-500 uppercase">On this page</p>

				{#if data.post.toc.length > 0}
					<nav class="mt-4 space-y-2 text-sm">
						{#each data.post.toc as item (item.id)}
							<div>
								<a
									class="block rounded-lg px-2 py-1 text-slate-700 hover:bg-white hover:text-slate-950"
									href={`#${item.id}`}
								>
									{item.text}
								</a>

								{#if item.children && item.children.length > 0}
									<div class="mt-1 space-y-1 pl-4">
										{#each item.children as child (child.id)}
											<a
												class="block rounded-lg px-2 py-1 text-slate-500 hover:bg-white hover:text-slate-900"
												href={`#${child.id}`}
											>
												{child.text}
											</a>
										{/each}
									</div>
								{/if}
							</div>
						{/each}
					</nav>
				{:else}
					<p class="mt-4 text-sm leading-6 text-slate-500">No TOC available.</p>
				{/if}
			</div>

			<a
				class="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:text-slate-950"
				href={resolve('/')}
			>
				Back to posts
			</a>
		</aside>
	</div>
</main>
