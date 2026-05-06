import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

// Handle GET request (fetch current user)
export async function GET() {
    const session = await getSession();

    // If no session - user is not logged in
    if (!session) {
        return NextResponse.json(
            { user: null }, 
            { status: 200 }
        );
    }

    // Return session data (user info)
    return NextResponse.json({ user: session });
}