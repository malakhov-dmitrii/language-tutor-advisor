<script lang="ts">
	import { page } from '$app/stores';
	import { Button, Helper, Input, Label, Select, Textarea } from 'flowbite-svelte';

	let levels = [
		{ value: 'A1', name: 'A1' },
		{ value: 'A2', name: 'A2' },
		{ value: 'B1', name: 'B1' },
		{ value: 'B2', name: 'B2' },
		{ value: 'C1', name: 'C1' },
		{ value: 'C2', name: 'C2' }
	];

	$: level = levels[0].value;
</script>

<div class="prose m-auto mt-12 pb-24">
	<h1>Get inspiration to talk with your student</h1>
	<p>
		We have collected a lot of questions that you can ask your student to inspire them to talk. You
		can also add your own questions to the list.
	</p>

	<hr />

	<form method="post" class="bg-white rounded-md p-6 shadow-md">
		<h2 class="mt-0">Base info</h2>
		<div class="grid grid-rows-1 grid-cols-2 gap-4">
			<div>
				<Label for="name" class="mb-2">Name</Label>
				<Input type="text" id="name" name="name" placeholder="John Doe" required />
			</div>
			<div>
				<Label for="age" class="mb-2">Age</Label>
				<Input type="number" id="age" name="age" placeholder="24" required />
			</div>
			<div>
				<Label for="lang" class="mb-2">Language</Label>
				<Input type="text" id="lang" name="lang" placeholder="English" required />
			</div>
			<div>
				<Label for="level" class="mb-2">Language level</Label>
				<Select id="level" name="level" items={levels} bind:value={level} />
			</div>
		</div>
		<div class="mt-4">
			<Label for="bio" class="mb-2">He/she is interested in ...</Label>
			<Textarea
				type="text"
				id="bio"
				name="bio"
				placeholder="Software, relocation to the US, music"
				required
			/>
			<Helper class="mt-0">
				Better to make it kind of a list of tags, but you can give a free text with as much context
				as you want.
			</Helper>
		</div>

		{#if $page.form?.error}
			<Helper color="red">{JSON.stringify($page.form.error)}</Helper>
		{/if}

		<div class="mt-6">
			<Button type="submit">Submit</Button>
		</div>
	</form>

	{#if $page.form?.body}
		<hr />
		<h2>Here are your proposals:</h2>

		{#each $page.form.body.split('\n') as text}
			<p>{text}</p>
		{/each}
	{/if}
</div>
