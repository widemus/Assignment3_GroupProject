import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';
import { setSession } from '@/lib/auth';
import { validateLogin } from '@/lib/validation';

// Handles user login and session creation
export async function POST(request) {
    const loginData = await request.json();
    const { email, password } = loginData;

    // Validate input fields before touching the database
    const checkResult = validateLogin({ email, password });

    if (!checkResult.valid) {
        return NextResponse.json(
            { message: checkResult.error },
            { status: 400 }
        );
    }
    try {

        // Look up user by email
        const findUserSql = 'SELECT id, username, password_hash, role FROM users WHERE email = ?';
        const [results] = await db.query(findUserSql, [email]);

        // Return the message for unknown email
        if (results.length === 0) {
            return NextResponse.json(
                { message: 'Authentication failed: check your details' },
                { status: 401 }
            );
        }

        const account = results[0];

        // Compare submitted password against stored hash
        const isMatch = await bcrypt.compare(password, account.password_hash);

        if (!isMatch) {
            return NextResponse.json(
                { message: 'Authentication failed: check your details' },
                { status: 401 }
            );
        }

        // Create session cookie so user stays logged in
        await setSession({
            userId: account.id,
            role: account.role,
            username: account.username
        });
        return NextResponse.json({
            status: 'Authorized',
            userId: account.id,
            userRole: account.role,
            userName: account.username,
        });
    } catch(err) {
        console.error('Login error:', err);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}