import { NextResponse } from 'next/server';

const COOKIE_NAME = 'neuracortex_session';

const AUTH_ROUTES = ['/auth/login', '/auth/register'];

const ROLE_ROUTES = {
    '/admin': ['admin'],
    '/events/create': ['organiser', 'admin'],
};

export function proxy(request) {
    const { pathname } = request.nextUrl;
    const cookie = request.cookies.get(COOKIE_NAME);

    let session = null;
    if (cookie) {
        try {
            session = JSON.parse(Buffer.from(cookie.value, 'base64').toString('utf8'));
        } catch {
            session = null;
        }
    }

    if (session && AUTH_ROUTES.some(r => pathname.startsWith(r))) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    const protectedPrefixes = ['/bookings', '/events/create', '/events/edit', '/admin'];
    if (!session && protectedPrefixes.some(p => pathname.startsWith(p))) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    for (const [route, allowedRoles] of Object.entries(ROLE_ROUTES)) {
        if (pathname.startsWith(route)) {
            if (!session || !allowedRoles.includes(session.role)) {
                return NextResponse.redirect(new URL('/', request.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/auth/:path*',
        '/bookings/:path*',
        '/events/create',
        '/events/edit/:path*',
        '/admin/:path*',
    ],
};