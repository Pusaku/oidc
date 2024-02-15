import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { jwtDecode } from "jwt-decode";
import { COOKIE_NAME } from '$lib/server/constants';

// MS認証サイトからリダイレクトされる、form_post指定なのでPOSTで呼ばれる
export const POST: RequestHandler = async ({ request, cookies, locals }) => {
    // bodyからid_token（jwt）を取得
    const formData = await request.formData();
    const jwt = formData.get("id_token");
    if (jwt) {
        const token: { sub: string, nonce: string, email: string  } = jwtDecode(jwt.toString());
        cookies.set(COOKIE_NAME, token.email, { path: '/' });
        redirect(303, "/console");
    }
    redirect(303, "/login");
};