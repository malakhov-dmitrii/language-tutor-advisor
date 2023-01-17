import type { PageServerLoad } from './$types';
import { getBasePrompt, openai } from '@/lib/openai';
import { prisma } from '@/lib/prisma';
import { fail, json, redirect, type Actions, type Handle } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.getSession();

	if (session?.user?.email) {
		const user = await prisma.user.findUnique({
			where: {
				email: session.user.email
			}
		});

		if (!user) throw redirect(307, '/auth');

		const savedStudents = await prisma.savedStudent.findMany({
			where: {
				userId: user.id
			}
		});

		return {
			session: session,
			students: savedStudents
		};
	} else {
		throw redirect(307, '/auth');
	}
};

export const actions: Actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const name = data.get('name') as string;
		const age = data.get('age') as string;
		const language = data.get('lang') as string;
		const level = data.get('level') as string;
		const bio = data.get('bio') as string;

		const session = await event.locals.getSession();

		if (!session?.user?.email) return fail(401, { error: 'Not logged in' });

		if (!name || !age || !language || !level || !bio) {
			return fail(400, { error: 'Missing data' });
		}

		const student = await prisma.savedStudent.create({
			data: {
				age: parseInt(age),
				bio,
				language,
				level,
				name,
				user: {
					connect: {
						email: session.user.email
					}
				}
			}
		});

		const prompt = `${getBasePrompt({
			age,
			bio,
			language,
			level,
			name
		})}

Also, provide at least 2 topics that are not relevant to them, but can be engaging for them

Make topics as specific as you can, and provide 2-3 opening phrases for each topic for person who is not aware of the topic`;

		const response = await openai.createCompletion({
			model: 'text-davinci-003',
			prompt: prompt,
			temperature: 0.7,
			max_tokens: 256,
			top_p: 1,
			frequency_penalty: 0,
			presence_penalty: 0
		});

		const text = response.data.choices[0].text;
		if (!text) return fail(500, { error: 'No response from OpenAI' });

		await prisma.openAiMessage.create({
			data: {
				prompt,
				reply: text,
				student: {
					connect: {
						id: student.id
					}
				}
			}
		});

		throw redirect(307, `/student/${student.id}`);
	}
};
