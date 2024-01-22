import { Issuer, generators } from "openid-client";
import { error, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET = (async ({ locals }) => {
    const session = locals.session;
    if (session.user_id !== undefined) {
        throw error(400, 'session state is invalid');
    }
    // 発行者（Issuer）サイトからOpenID情報を取得、サイトは公開されている（MSサイトより）
    const issuer = await Issuer.discover(process.env.OIDC_ROOT_URL);
    // クライアント情報を設定、idとurlはEntraIDで登録、responsetypeにid_tokenを指定するとoidcになる
    const client = new issuer.Client({
        client_id: process.env.CLIENT_ID,
        response_types: ["id_token"],
        redirect_uris: [process.env.REDIRECT_URL],
    });
    // MSのoidcにはnonceが必須、stateはoauthで用いるのでここでは未使用
    const nonce = generators.nonce();
    // const state = generators.state();
    // 認証用のurl作成、form_post指定で認証情報はbodyで返す
    const authurl = client.authorizationUrl({
        scope: "openid email profile",
        response_mode: "form_post",
        nonce,
        // state,
    });
    locals.session.oidc_nonce = nonce;
    await locals.session.save();
    // MS認証サイトへリダイレクト、結果は/callbackへリダイレクトされる
    redirect(303, authurl);
}) satisfies RequestHandler;