import { Issuer, generators } from "openid-client";
import { redirect } from "@sveltejs/kit";

export const actions = {
    default: async (event) => {
        const issuer = await Issuer.discover(import.meta.env.VITE_OIDC_ROOT_URL);
        const client = new issuer.Client({
            client_id: import.meta.env.VITE_CLIENT_ID,
            response_types: ["id_token"],
            redirect_uris: [import.meta.env.VITE_REDIRECT_URL],
        });
        const nonce = generators.nonce();
        const state = generators.state();
        // console.log(nonce, state); 
        const authurl = client.authorizationUrl({
            scope: "openid email profile",
            response_mode: "form_post",
            nonce,
            state,
        });
        const expires = new Date(Date.now() + 1000 * 30);
        event.cookies.set("auth-nonce", nonce, {
            path: '/',
            httpOnly: true,
            expires: expires,
        });
        event.cookies.set("auth-state", state, {
            path: '/',
            httpOnly: true,
            expires: expires,
        });
        redirect(303, authurl);
    },
}