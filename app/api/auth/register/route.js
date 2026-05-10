import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';
import { setSession } from '@/lib/auth';
import { validateRegister } from '@/lib/validation';

// Handles new user registration
export async function POST(req) {
    const signupData = await req.json();
    const { username, email, password } = signupData;

    // Validate input fields before touching the database
    const validationResult = validateRegister({ username, email, password });

    if (!validationResult.valid) {
        return NextResponse.json(
            { message: validationResult.error },
            { status: 400 }
        );
    }
    try {

        // Check for existing account with the same email or username
        const checkQuery = 'SELECT id FROM users WHERE email = ? OR username = ?';
        const [duplicateFound] = await db.query(checkQuery, [email, username]);

        if (duplicateFound.length > 0) {
            return NextResponse.json(
                { message: 'This email or username is already taken' },
                { status: 409 }
            );
        }

        // Hash password before storing
        const hashPassword = await bcrypt.hash(password, 12);

        // Insert new user with default attendee role
        const sql = 'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)';
        const [saveOperation] = await db.query(sql, [username, email, hashPassword, 'attendee']);
        const newId = saveOperation.insertId;

        // Create session token so user is logged in immediately after registration
        await setSession({
            userId: newId,
            role: 'attendee',
            username
        });
        return NextResponse.json(
            {
                status: 'Account created',
                id: newId,
                userRole: 'attendee'
            },
            { status: 201 }
        );
    } catch (serverError) {
        console.error('Registration error:', serverError);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}