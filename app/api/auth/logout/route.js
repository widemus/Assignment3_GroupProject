import { NextResponse } from 'next/server';
import { clearSession } from '@/lib/auth';

// Handle POST request (logout)
export async function POST() {

    // Delete session cookie
    await clearSession();

    // Confirm logout
    return NextResponse.json({ message: 'Logged out.' });
}