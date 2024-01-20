import { json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generators } from "openid-client";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import {  createSigner, createDecoder, createVerifier } from 'fast-jwt';
import { session } from '$lib/server/session';

// MS認証サイトからリダイレクトされる、form_post指定なのでPOSTで呼ばれる
export const POST: RequestHandler = async ({ request, cookies }) => {
    // bodyからid_token（jwt）を取得
    const formData = await request.formData();
    const jwt = formData.get("id_token");
    // const state = formData.get("state");
    if (jwt) {
        // デコード、fastjwtとjwtdecodeどっちでもいい
        const token1 = createDecoder()(jwt.toString());
        const token2: JwtPayload & { nonce?: string } = jwtDecode(jwt.toString());
        // rsaによる暗号化と複合化、sessionの保護が必要な時ように試したのみ、
        const session = encode(token1.sub);
        const decoded = decode(session);
        // セッション管理のために新たにid設定、セキュリティ観点でnonceとかの使いまわしはしない
        const session_id = generators.random();
        // cookieをセット（headerでもいい）
        cookies.set('x-session-id', session_id, { path: '/' });
        return json({
            sub1: token1.sub,
            sub2: token2.sub,
            dsub: decoded.sub,
            session_id: session_id,
        },{
            // headerをセット（cookieとどっちでもいい）
            headers: { 'x-session-id': session_id }
        });
    }
    redirect(303, "/login");
};

// openssl genrsa -out privatekey.pem 4096
// openssl rsa -in privatekey.pem -out publickey.pem -outform PEM -pubout

const encode = (token: string) => {
    return createSigner({
        key: import.meta.env.VITE_PRIVATE_KEY, 
        algorithm: "RS512",
    })({sub: token });
};

const decode = (token: string) => {
    return createVerifier({
        key: import.meta.env.VITE_PUBLIC_KEY,
        algorithms: ["RS512"],
    })(token);
};
