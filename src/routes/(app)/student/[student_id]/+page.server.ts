import { openai } from '@/lib/openai';
import { prisma } from '@/lib/prisma';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals, params }) => {
	const { student_id } = params;
	const student = await prisma.savedStudent.findUnique({
		where: {
			id: student_id
		},
		include: { openAiMessages: true, ratedLines: true }
	});

	return {
		props: {
			student
		}
	};
}) satisfies PageServerLoad;
