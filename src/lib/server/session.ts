// import { writable } from "svelte/store";
import dynamoose from "dynamoose";
import type { Item } from "dynamoose/dist/Item";
import { generators } from "openid-client";

import 'dotenv/config';
dynamoose.aws.ddb.local("http://localhost:8000");

export interface PreloginSession extends Item {
    user_id?: undefined;
    session_id: string;
    ttl: number;
    email?: string;
    oidc_nonce?: string;
    after_login_path?: string;
}

export interface LoginSession extends Item {
    user_id: string;
    session_id: string;
    ttl: number;
    email: string;    
    oidc_nonce?: string;
}

export type Session = PreloginSession | LoginSession;

const preloginSessionSchema = new dynamoose.Schema({
    session_id: { 
        type: String, 
        hashKey: true,
    },
    ttl: Number,
    oidc_nonce: String,
    after_login_path: String,
});

const loginSessionSchema = new dynamoose.Schema({
    session_id: {
        type: String,
        hashKey: true,
    },
    ttl: Number,
    user_id: {
        type: String,
        index: {
            type: 'global',
        },
    },
    email: String,
})

const Session = dynamoose.model<Session>('Session', [preloginSessionSchema, loginSessionSchema]);

new dynamoose.Table('login_session', [Session], {
    expires: {
        ttl: 10 * 1000, // 10秒
        attribute: 'ttl',
        items: {
            returnExpired: false,
        },
    },
});

export async function initSession(): Promise<PreloginSession> {
    const session_id = generators.random();
    const session = new Session({ session_id });
    await session.save({ overwrite: false, return: 'item' });
    return session as PreloginSession;
}

export async function findSession(session_id: string): Promise<Session | undefined> {
    const res = await Session.query('session_id').eq(session_id).exec();
    return res[0];
}

export async function login(
    session: Session,
    email: string,
    user_id: string,
): Promise<LoginSession> {
   const session_id = generators.random();
   await session.delete();
   const new_session = new Session({ session_id, email, user_id });
   await new_session.save();
   return new_session as LoginSession; 
}