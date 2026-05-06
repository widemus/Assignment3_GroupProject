import { NextResponse } from 'next/server';

const COOKIE_NAME = 'neuracortex_session';

const AUTH_ROUTES = ['/auth/login', '/auth/register'];

// Role-based route protection
const ROLE_ROUTES = {
    '/admin': ['admin'],
    '/events/create': ['organiser', 'admin'],
};

export function middleware (request) {

    // Extract current URL path
    const { pathname } = request.nextUrl;

    // Get session cookie
    const cookie = request.cookies.get(COOKIE_NAME);

    let session = null;

    // Try to decode session from cookie
    if (cookie) {
        try {

            // Decode base64 - parse JSON
            session = JSON.parse(
                Buffer.from(cookie.value, 'base64').toString('utf8')
            );
        } catch {

            // If corrupted - treat as not logged in
            session = null;
        }
    }

    // BLOCK AUTH PAGES IF LOGGED IN - redirect to homepage
    if (session && AUTH_ROUTES.some(r => pathname.startsWith(r))) {
        return NextResponse.redirect(
            new URL('/', request.url)
        );
    }

    // PROTECT PRIVATE ROUTES
    const protectedPrefixes = [
        '/bookings', 
        '/events/create', 
        '/events/edit', 
        '/admin'
    ];

     // If user is not logged in and tries to access protected route
    if (!session && protectedPrefixes.some(p => pathname.startsWith(p))) {
        return NextResponse.redirect(
            new URL('/auth/login', request.url)
        );
    }

     // ROLE-BASED ACCESS CONTROL
    for (const [route, allowedRoles] of Object.entries(ROLE_ROUTES)) {

         // If current path matches protected route
        if (pathname.startsWith(route)) {

            // If not logged in or role not allowed
            if (!session || !allowedRoles.includes(session.role)) {

                // Redirect to homepage
                return NextResponse.redirect(
                    new URL('/', request.url)
                );
            }
        }
    }

    return NextResponse.next();
}

// MIDDLEWARE CONFIG - define which routes this middleware applies to
export const config = {
    matcher: [
        '/auth/:path*',
        '/bookings/:path*',
        '/events/create',
        '/events/edit/:path*',
        '/admin/:path*',
    ],
};