import { error, json, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '@/lib/prisma';

export const PUT = (async ({ request, params, locals }) => {
	const session = await locals.getSession();

	if (!session?.user?.email) throw error(401, 'Unauthorized');
	const a = await request.json();

	await prisma.savedStudent.update({
		where: {
			id: params.student_id
		},
		data: {
			...a
		}
	});

	return json({
		ok: true
	});
}) satisfies RequestHandler;
