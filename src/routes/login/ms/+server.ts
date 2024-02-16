import { Issuer, generators } from "openid-client";
import { error, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import "dotenv/config";

const OIDC_ROOT_URL = "https://login.microsoftonline.com/446f1ba7-ebdd-4a47-be5b-09582e1e546f/v2.0/.well-known/openid-configuration";
// const CLIENT_ID = "76ee303b-59a2-4152-a448-f63933727c07";
const REDIRECT_URL = "https://witty-river-01ea31600.4.azurestaticapps.net/callback";        

export const GET = (async ({ locals }) => {
    // 発行者（Issuer）サイトからOpenID情報を取得、サイトは公開されている（MSサイトより）
    const issuer = await Issuer.discover(OIDC_ROOT_URL);
    // クライアント情報を設定、idとurlはEntraIDで登録、responsetypeにid_tokenを指定するとoidcになる
    const client = new issuer.Client({
        client_id: process.env.CLIENT_ID,
        response_types: ["id_token"],
        redirect_uris: [REDIRECT_URL],
    });
    // MSのoidcにはnonceが必須、stateはoauthで用いるのでここでは未使用
    const nonce = generators.nonce();
    // const state = generators.state();
    // 認証用のurl作成、form_post指定で認証情報はbodyで返す
    const authurl = client.authorizationUrl({
        scope: "openid email profile",
        response_mode: "form_post",
        nonce,
    });
    // MS認証サイトへリダイレクト、結果は/callbackへリダイレクトされる
    redirect(303, authurl);
}) satisfies RequestHandler;