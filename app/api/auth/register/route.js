import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { setSession } from '@/lib/auth';
import { validateRegister } from '@/lib/validation';

// Handle POST request (register)
export async function POST(request) {

    // Parse request body
    const body = await request.json();
    const { username, email, password } = body;

    // Validate input
    const check = validateRegister({ username, email, password });
    if (!check.valid) {
        return NextResponse.json(
            { error: check.error }, 
            { status: 400 }
        );
    }

    try {
        // Check if email or username already exists
        const [existing] = await pool.query(
            'SELECT id FROM users WHERE email = ? OR username = ?',
            [email, username]
        );

        if (existing.length > 0) {
            return NextResponse.json(
                { error: 'Email or username already in use.' },
                { status: 409 }
            );
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        //  Insert new user into db — all new registrations are 'attendee' by default
        const [result] = await pool.query(
            'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [username, email, password_hash, 'attendee']
        );

        const userId = result.insertId;

        // Automatically log user in after registration
        await setSession({ 
            userId, 
            role: 'attendee', 
            username 
        });

        // Send success response
        return NextResponse.json(
            { 
                message: 'Registration successful.', 
                userId, role: 'attendee', 
                username 
            },
            { status: 201 }
        );
    } catch (err) {
        console.error('[REGISTER ERROR]', err);

        return NextResponse.json(
            { error: 'Server error.' }, 
            { status: 500 }
        );
    }
}