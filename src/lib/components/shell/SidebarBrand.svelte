<script lang="ts">
	import { resolve } from '$app/paths';
	import { site } from '$lib/config/site';
</script>

<a
	class="group block rounded-md text-white no-underline outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
	href={resolve('/')}
>
	<span class="block text-2xl leading-tight font-bold group-hover:text-indigo-200">{site.name}</span
	>
	<span class="mt-2 block max-w-60 text-sm leading-relaxed text-gray-400">{site.description}</span>
</a>
