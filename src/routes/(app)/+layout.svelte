<script lang="ts">
	import '../../global.css';
	import {
		Avatar,
		Dropdown,
		DropdownDivider,
		DropdownItem,
		Navbar,
		NavBrand,
		NavHamburger,
		NavLi,
		NavUl
	} from 'flowbite-svelte';

	import { page } from '$app/stores';
	import { signOut } from '@auth/sveltekit/client';

	import Toasts from '@/components/Toasts.svelte';
</script>

<Navbar let:hidden let:toggle class="shadow-sm">
	<NavBrand href="/">
		<!-- <img src={img} class="h-6 mr-3 sm:h-14" alt="Logo" /> -->
		<div>
			<h3 class="text-xl md:text-3xl font-bold">Tutor Advisor</h3>
			<p>Get inspiration</p>
		</div>
	</NavBrand>
	<!-- <NavHamburger on:click={toggle} /> -->
	<div class="flex items-center gap-2 mt-4 md:order-2 sm:mt-0">
		{#if $page.data.session}
			<div id="avatar-menu" class="flex cursor-pointer items-center gap-2">
				{#if $page.data.session.user?.image}
					<Avatar src={$page.data.session.user.image} />
				{/if}
				<div class="flex flex-col text-sm">
					<span class="text-sm">
						{$page.data.session.user?.name ?? 'User'}
					</span>
					<span class="text-xs font-light text-gray-400"> Tutor </span>
				</div>
			</div>
		{/if}
		<NavHamburger on:click={toggle} />
	</div>
	<NavUl {hidden} class="order-1">
		<NavLi active={$page.route.id === '/(app)'}>
			<a href="/">Home</a>
		</NavLi>
		<NavLi active={$page.route.id === '/(app)/about'}>
			<a href="/about">About</a>
		</NavLi>
	</NavUl>

	<Dropdown placement="bottom" triggeredBy="#avatar-menu">
		<DropdownItem href="/profile">Settings</DropdownItem>
		<DropdownDivider />
		<DropdownItem on:click={() => signOut()}>Sign out</DropdownItem>
	</Dropdown>
</Navbar>

<div class="flex container mx-auto">
	<aside class="border-r border-gray-700 pl-8 py-12 max-w-xs">
		<h3 class="text-xl font-bold px-4">Saved students:</h3>
		<div class="flex-col flex space-y-2 mt-4 pr-4">
			{#each $page.data.students as student}
				<div class="px-4 py-2 hover:bg-gray-100 transition-all rounded-md">
					<a class="text-lg w-full font-medium" href={`/student/${student.id}`}>{student.name}</a>
					<p title={student.bio} class="text-sm line-clamp-2 max-w-[240px] text-gray-400">
						{student.bio}
					</p>
					<div class="flex flex-wrap gap-2 text-xs text-gray-400 mt-2">
						<p class="bg-gray-700 rounded-full px-2 text-white py-1">{student.language}</p>
						<p class="bg-gray-700 rounded-full px-2 text-white py-1">{student.level}</p>
					</div>
				</div>
				<hr />
			{/each}
		</div>
	</aside>

	<main class="container m-auto">
		<slot />
	</main>
</div>

<Toasts />
