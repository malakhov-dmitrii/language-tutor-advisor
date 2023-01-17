<script lang="ts">
	import type { OpenAiMessage, RatedLine, SavedStudent } from '@prisma/client';
	import axios from 'axios';
	import { Button, Popover } from 'flowbite-svelte';

	export let line: string;
	export let idx: number;
	export let ratedLine: RatedLine | undefined;
	export let student: SavedStudent & {
		openAiMessages: OpenAiMessage[];
		ratedLines: RatedLine[];
	};

	let loading = false;
</script>

<div class="relative group">
	<p
		id={`line-${idx}`}
		class={`hover:bg-slate-100 transition rounded-md px-4 border-l-4 bg-opacity-10 ${
			ratedLine
				? ratedLine.markedGood
					? 'bg-green-400 border-green-400'
					: 'bg-red-400 border-red-400'
				: ''
		}`}
	>
		{line}
	</p>
	<div
		class="w-64 text-sm font-light not-prose absolute -right-64 bg-white px-4 py-4 rounded-md shadow-lg transition bg-opacity-50 opacity-0 group-hover:opacity-100 top-0"
	>
		<div class="flex space-x-2 items-center">
			<Button
				disabled={loading}
				outline
				color="green"
				size="xs"
				on:click={() => {
					loading = true;
					axios
						.post(`/api/student/${student.id}/rate-line`, { line, markedGood: true })
						.then(() => {
							loading = false;
							window.location.reload();
						});
				}}
				type="submit"
				class="flex-1"
			>
				Good
			</Button>
			<Button
				disabled={loading}
				outline
				color="red"
				size="xs"
				on:click={() => {
					loading = true;
					axios
						.post(`/api/student/${student.id}/rate-line`, { line, markedGood: false })
						.then(() => {
							loading = false;
							window.location.reload();
						});
				}}
				type="submit"
				class="flex-1"
			>
				Bad
			</Button>
		</div>
		<Button
			disabled={loading}
			on:click={() => {
				loading = true;
				axios.post(`/api/student/${student.id}/dive-deeper`, { line }).then(() => {
					loading = false;
					window.location.reload();
				});
			}}
			size="xs"
			type="submit"
			class="w-full mt-2">Get deeper into this topic</Button
		>
	</div>
</div>
