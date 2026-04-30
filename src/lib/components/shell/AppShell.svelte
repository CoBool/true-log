<script lang="ts">
	import type { Snippet } from 'svelte';
	import Sidebar from './Sidebar.svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="min-h-screen bg-gray-50 text-gray-900">
	<div class="mx-auto grid min-h-screen w-full max-w-[96rem] sm:grid-cols-[16rem_minmax(0,1fr)]">
		<Sidebar />

		<div class="min-w-0 bg-gray-50">
			{@render children()}
		</div>
	</div>
</div>
