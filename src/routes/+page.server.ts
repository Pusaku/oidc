import "dotenv/config";

import type { PageServerLoad } from './$types';

export const load = (async ({  }) => {
    return { 
        OIDC_ROOT_URL: process.env.OIDC_ROOT_URL,
        CLIENT_ID: process.env.CLIENT_ID,
        REDIRECT_URL: process.env.REDIRECT_URL,
    }
}) satisfies PageServerLoad;
