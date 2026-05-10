import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

// Returns current session data so the frontend knows who is logged in
export async function GET() {
    const activeSession = await getSession();

    if (!activeSession) {
        return NextResponse.json({
            loggedIn: false,
            userData: null
        });
    }
    return NextResponse.json({
        loggedIn: true,
        userData: activeSession
    });
}