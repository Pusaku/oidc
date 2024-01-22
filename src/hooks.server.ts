import { initSession, findSession } from "$lib/server/session";
import { COOKIE_NAME } from "$lib/server/constants";
import type { Handle } from "@sveltejs/kit"

export const handle: Handle = async ({ event, resolve }) => {
    const session_id = event.cookies.get(COOKIE_NAME);
    let session = undefined;
    if (session_id === undefined) {
        session = await initSession();
        event.cookies.set(COOKIE_NAME, session.session_id, { path: '/'});
    } else {
        session = await findSession(session_id);
        if (session === undefined) {
            session = await initSession();
            event.cookies.set(COOKIE_NAME, session.session_id, { path: '/'});    
        }
    }
    event.locals.session = session;
    
	return await resolve(event);
};

