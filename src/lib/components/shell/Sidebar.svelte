<script lang="ts">
	import SidebarBrand from './SidebarBrand.svelte';
	import SidebarFooter from './SidebarFooter.svelte';
	import SidebarNav from './SidebarNav.svelte';
</script>

<aside
	class="border-b border-gray-800 bg-gray-950 text-white sm:sticky sm:top-0 sm:h-screen sm:border-r sm:border-b-0"
>
	<div class="flex h-full flex-col gap-6 px-4 py-5 sm:px-5 sm:py-8">
		<SidebarBrand />
		<SidebarNav />
		<SidebarFooter />
	</div>
</aside>
