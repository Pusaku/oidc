import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';
import { COOKIE_NAME } from '$lib/server/constants';

export const GET = (async ({ cookies, locals }) => {
	cookies.set(COOKIE_NAME, 'undefined', { path: '/' });
	throw redirect(303, '/');
}) satisfies RequestHandler;