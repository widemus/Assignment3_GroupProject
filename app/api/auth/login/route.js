import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { setSession } from '@/lib/auth';
import { validateLogin } from '@/lib/validation';

// Handle POST request (login)
export async function POST(request) {

    // Parse JSON body from request
    const body = await request.json();
    const { email, password } = body;

    // Validate input (email + password format)
    const check = validateLogin({ email, password });
    if (!check.valid) {
        return NextResponse.json(
            { error: check.error }, 
            { status: 400 }
        );
    }

    try {
        // Query user by email
        const [rows] = await pool.query(
            'SELECT id, username, password_hash, role FROM users WHERE email = ?',
            [email]
        );

        // If user not found - invalid credentials
        if (rows.length === 0) {
            return NextResponse.json(
                { error: 'Invalid credentials.' }, 
                { status: 401 }
            );
        }

        const user = rows[0];

        // Compare entered password with hashed password from db
        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            return NextResponse.json(
                { error: 'Invalid credentials.' }, 
                { status: 401 }
            );
        }

        // Create session 
        await setSession({ 
            userId: user.id, 
            role: user.role, 
            username: user.username 
        });

        // Send success response with basic user info
        return NextResponse.json({
            message: 'Login successful.',
            userId: user.id,
            role: user.role,
            username: user.username,
        });
    } catch (err) {
        console.error('[LOGIN ERROR]', err);

        return NextResponse.json(
            { error: 'Server error.' }, 
            { status: 500 }
        );
    }
}