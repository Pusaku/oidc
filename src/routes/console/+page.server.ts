import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { COOKIE_NAME } from '$lib/server/constants';

export const load = (async ({ cookies }) => {
    const email = cookies.get(COOKIE_NAME);
    return { email };
}) satisfies PageServerLoad;