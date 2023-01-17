import { prisma } from '@/lib/prisma';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
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
