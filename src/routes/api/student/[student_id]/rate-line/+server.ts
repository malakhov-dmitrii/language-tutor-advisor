import { error, json, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '@/lib/prisma';

export const POST = (async ({ request, params, locals }) => {
	const session = await locals.getSession();

	if (!session?.user?.email) throw error(401, 'Unauthorized');
	const { line, markedGood } = await request.json();

	await prisma.ratedLine.upsert({
		where: {
			line
		},
		create: {
			line,
			markedGood,
			student: {
				connect: { id: params.student_id }
			}
		},
		update: {
			markedGood
		}
	});

	return json({});
}) satisfies RequestHandler;
