import { error, json, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '@/lib/prisma';
import { getBasePrompt, openai } from '@/lib/openai';

export const POST = (async ({ request, params, locals }) => {
	const session = await locals.getSession();

	if (!session?.user?.email) throw error(401, 'Unauthorized');
	const { topic } = await request.json();

	const student = await prisma.savedStudent.findUnique({
		where: {
			id: params.student_id
		}
	});

	if (!student) throw error(404, 'Not found');

	const { age, bio, language, level, name } = student;

	const prompt = `${getBasePrompt({
		age,
		bio,
		language,
		level,
		name
	})}

Given the following topic, can you provide 2-3 opening phrases to dive deeper into this topic for person who is not aware of the topic:

${topic}
		`;

	const response = await openai.createCompletion({
		model: 'text-davinci-003',
		echo: false,
		prompt,
		temperature: 0.7,
		max_tokens: 256,
		top_p: 1,
		frequency_penalty: 0,
		presence_penalty: 0
	});

	const text = response.data.choices[0].text;

	if (!text) throw error(500, 'No response from OpenAI');

	await prisma.openAiMessage.create({
		data: {
			prompt,
			reply: text,
			student: { connect: { id: student.id } }
		}
	});

	return json({ text });
}) satisfies RequestHandler;
