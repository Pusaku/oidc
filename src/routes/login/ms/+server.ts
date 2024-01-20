import { Issuer, generators } from "openid-client";
import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types.js";

export const GET: RequestHandler = (async () => {
    // 発行者（Issuer）サイトからOpenID情報を取得、サイトは公開されている（MSサイトより）
    const issuer = await Issuer.discover(import.meta.env.VITE_OIDC_ROOT_URL);
    // クライアント情報を設定、idとurlはEntraIDで登録、responsetypeにid_tokenを指定するとoidcになる
    const client = new issuer.Client({
        client_id: import.meta.env.VITE_CLIENT_ID,
        response_types: ["id_token"],
        redirect_uris: [import.meta.env.VITE_REDIRECT_URL],
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
    // MS認証サイトへリダイレクト、結果は/callbackへリダイレクトされる
    redirect(303, authurl);
});