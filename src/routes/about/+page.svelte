<script lang="ts">
	import { site } from '$lib/config/site';
</script>

<svelte:head>
	<title>About | {site.name}</title>
	<meta name="description" content={`About ${site.name}`} />
</svelte:head>

<main class="mx-auto w-full max-w-3xl px-4 py-12 text-gray-800">
	<section
		class="prose prose-gray max-w-none prose-a:text-indigo-600"
		aria-labelledby="about-title"
	>
		<p class="text-sm font-bold text-indigo-600 uppercase">About</p>
		<h1 id="about-title">{site.name}</h1>
		<p>
			<code>{site.name}</code> is a SvelteKit, TypeScript, and plain Markdown blog template.
		</p>
		<p>
			It is inspired by Chirpy's information architecture and technical writing experience, but does
			not use Jekyll, Ruby, Liquid, or Bootstrap.
		</p>
		<p>The first version focuses on posts, categories, tags, and a Markdown content layer.</p>
	</section>
</main>
