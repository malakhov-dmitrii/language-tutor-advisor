import { prisma } from '@/lib/prisma';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const session = await event.locals.getSession();
	if (session?.user?.email) {
		throw redirect(300, '/');
	}
};
