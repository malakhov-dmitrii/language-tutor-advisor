<script lang="ts">
	import { page } from '$app/stores';
	import { onDestroy, onMount } from 'svelte';
	import type { OpenAiMessage, RatedLine, SavedStudent } from '@prisma/client';
	import { Blockquote, Button, Popover } from 'flowbite-svelte';
	import axios from 'axios';
	import SuggestionLine from '@/components/SuggestionLine.svelte';
	import { fade } from 'svelte/transition';

	let student: SavedStudent & { openAiMessages: OpenAiMessage[]; ratedLines: RatedLine[] };
	const unsubscribe = page.subscribe((page) => {
		student = page.data.props.student;
	});
	onDestroy(unsubscribe);

	let axiosRequest: Promise<any>;
</script>

{#await axiosRequest}
	<div
		transition:fade
		class="fixed w-full h-full bg-slate-400 bg-opacity-50 z-10 flex flex-col justify-center items-center top-0 left-0"
	>
		<div class="bg-white flex px-8 rounded-md py-2 items-center">
			<p class="text-6xl font-mono font-medium animate-pulse text-center">Loading...</p>
		</div>
	</div>
{/await}

<div class="prose m-auto mt-12 pb-24">
	<h1 class="mb-0">{student?.name}</h1>
	<div class="flex space-x-2 text-xs">
		<p class="bg-gray-700 rounded-full px-2 text-white py-1">
			{student?.age} years old
		</p>
		<p class="bg-gray-700 rounded-full px-2 text-white py-1">
			{student?.language}
		</p>
		<p class="bg-gray-700 rounded-full px-2 text-white py-1">
			{student?.level}
		</p>
	</div>
	<div class="flex justify-between items-center">
		<Blockquote>
			{student.bio}
		</Blockquote>

		<Button
			size="xs"
			outline
			on:click={() => {
				const bio = prompt('Enter new bio', student.bio);
				if (bio) {
					student.bio = bio;
					axiosRequest = axios
						.put(`/api/student/${student.id}`, { bio: student.bio })
						.then((res) => {
							window.location.reload();
						});
				}
			}}>Edit</Button
		>
	</div>

	<h2>Topics history:</h2>

	{#each student.openAiMessages as message}
		{#each message.reply.split('\n') as line, idx}
			{@const ratedLine = student.ratedLines.find((ratedLine) => ratedLine.line === line)}

			<SuggestionLine {ratedLine} {idx} {line} {student} />
		{/each}
		<hr />
	{/each}

	<div class="flex space-x-4">
		<Button
			on:click={() => {
				axiosRequest = axios.post(`/api/student/${student.id}/more-topics`).then(() => {
					window.location.reload();
				});
			}}>Get more topics</Button
		>
		<Button
			on:click={() => {
				axiosRequest = axios.delete(`/api/student/${student.id}/history`).then(() => {
					window.location.reload();
				});
			}}
			color="red"
			outline>Clear history</Button
		>
	</div>
</div>
