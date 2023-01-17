import { error, json, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '@/lib/prisma';

export const DELETE = (async ({ request, params, locals }) => {
	const session = await locals.getSession();

	if (!session?.user?.email) throw error(401, 'Unauthorized');

	await prisma.ratedLine.deleteMany({
		where: { studentId: params.student_id }
	});

	await prisma.openAiMessage.deleteMany({
		where: { studentId: params.student_id }
	});

	return json({});
}) satisfies RequestHandler;
