import { NextResponse } from 'next/server';
import { clearSession } from '@/lib/auth';

// Handles user logout by clearing the session cookie
export async function POST() {
    try {
        await clearSession();
        return NextResponse.json({
            status: 'Success',
            message: 'User session has been cleared'
        });
    } catch(err) {
        console.error('Logout error:', err);
        return NextResponse.json(
            { message: 'Failed to log out correctly' },
            { status: 500 }
        );
    }
}