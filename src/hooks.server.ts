
import type { Handle } from "@sveltejs/kit"

export const handle: Handle = async ({ event, resolve }) => {
    // console.log("cookies:", event.cookies.getAll());
	return await resolve(event);
};

