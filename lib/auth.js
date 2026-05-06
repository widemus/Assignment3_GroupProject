import { cookies } from 'next/headers';

const COOKIE_NAME = 'neuracortex_session';


export async function setSession(payload) {
    const cookieStore = await cookies();
    const encoded = Buffer.from(JSON.stringify(payload)).toString('base64');
    cookieStore.set(COOKIE_NAME, encoded, {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, 
        secure: process.env.NODE_ENV === 'production',
    });
}


export async function getSession() {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(COOKIE_NAME);
    if (!cookie) return null;
    try {
        return JSON.parse(Buffer.from(cookie.value, 'base64').toString('utf8'));
    } catch {
        return null;
    }
}


export async function clearSession() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}