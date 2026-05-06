import { cookies } from 'next/headers';

const COOKIE_NAME = 'neuracortex_session';

// Save session data into a cookie
export async function setSession(payload) {
    const cookieStore = await cookies();
    const encoded = Buffer.from(JSON.stringify(payload)).toString('base64');

    // Set cookie with options
    cookieStore.set(COOKIE_NAME, encoded, {
        httpOnly: true, // prevents access from JavaScript (security against XSS)
        path: '/', // cookie available on entire site
        sameSite: 'lax', // helps prevent CSRF attacks
        maxAge: 60 * 60 * 24 * 7, 
        secure: process.env.NODE_ENV === 'production',
    });
}

// Retrieve session data from cookie
export async function getSession() {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(COOKIE_NAME);

    // If cookie doesn't exist - no session
    if (!cookie) return null;
    try {
        return JSON.parse(Buffer.from(cookie.value, 'base64').toString('utf8'));
    } catch {
        return null;
    }
}

// Delete session cookie (logout)
export async function clearSession() {
    const cookieStore = await cookies();

    // Remove cookie
    cookieStore.delete(COOKIE_NAME);
}