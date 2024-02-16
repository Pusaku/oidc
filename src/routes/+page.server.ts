import type { PageServerLoad } from './$types';
import "dotenv/config";
export const load = (async ({  }) => {
    return { app_name: process.env.APP_NAME };
    // return { 
    //     OIDC_ROOT_URL: process.env.OIDC_ROOT_URL,
    //     CLIENT_ID: process.env.CLIENT_ID,
    //     REDIRECT_URL: process.env.REDIRECT_URL,
    // }
}) satisfies PageServerLoad;
