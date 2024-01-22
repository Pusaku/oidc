import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { jwtDecode } from "jwt-decode";
import { COOKIE_NAME } from '$lib/server/constants';
import { login } from '$lib/server/session';

// MS認証サイトからリダイレクトされる、form_post指定なのでPOSTで呼ばれる
export const POST: RequestHandler = async ({ request, cookies, locals }) => {
    const session = locals.session;
    if (session.user_id !== undefined) {
        throw error(400, 'session state is invalid');
    }
    // bodyからid_token（jwt）を取得
    const formData = await request.formData();
    const jwt = formData.get("id_token");
    if (jwt) {
        const token: { sub: string, nonce: string, email: string  } = jwtDecode(jwt.toString());
        const new_session = await login(session, token.email, token.sub)
        cookies.set(COOKIE_NAME, new_session.session_id, { path: '/' });
        redirect(303, "/console");
    }
    redirect(303, "/login");
};