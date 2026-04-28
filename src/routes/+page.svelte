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
	<title>true_log</title>
	<meta name="description" content="SvelteKit과 plain Markdown으로 만든 개발 블로그입니다." />
</svelte:head>

<main class="mx-auto w-full max-w-5xl px-4 py-12 text-gray-800">
	<section class="mb-10" aria-labelledby="home-title">
		<p class="mb-2 text-sm font-bold text-indigo-600 uppercase">Markdown Blog</p>
		<h1 id="home-title" class="mb-4 text-4xl leading-tight font-bold text-gray-950 sm:text-5xl">
			true_log
		</h1>
		<p class="max-w-2xl text-lg leading-relaxed text-gray-600">
			Chirpy의 정보 구조를 참고해 SvelteKit, TypeScript, plain Markdown으로 다시 만든 개발
			블로그입니다.
		</p>
	</section>

	<section aria-labelledby="latest-posts-title">
		<div class="mb-4 flex flex-wrap items-end justify-between gap-3">
			<h2 id="latest-posts-title" class="text-2xl font-bold text-gray-950">Latest posts</h2>
			<a class="font-semibold text-indigo-600 no-underline hover:underline" href={resolve('/blog')}>
				View all posts
			</a>
		</div>

		{#if data.posts.length > 0}
			<ul class="m-0 grid list-none gap-4 p-0">
				{#each data.posts as post (post.slug)}
					<li>
						<a
							class="block rounded-lg border border-gray-300 bg-white p-5 text-inherit no-underline transition-colors hover:border-indigo-600 focus-visible:border-indigo-600 focus-visible:outline-none"
							href={resolve('/blog/[slug]', { slug: post.slug })}
						>
							<div class="mb-3 flex flex-wrap gap-2 text-sm text-gray-500">
								<time datetime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt)}</time
								>
								{#if post.pin}
									<span class="font-bold text-indigo-600">Featured</span>
								{/if}
							</div>
							<h3 class="mb-2 text-2xl leading-snug font-bold">{post.title}</h3>
							<p class="mb-4 leading-relaxed text-gray-600">{post.description}</p>
						</a>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="leading-relaxed text-gray-500">No public posts yet.</p>
		{/if}
	</section>
</main>
