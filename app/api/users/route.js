import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { validateRegister, validateRole } from '@/lib/validation';

// GET ALL USERS
export async function GET() {

    const session = await getSession();

    // Only admins allowed
    if (!session || session.role !== 'admin') {
        return NextResponse.json(
            { error: 'Unauthorised.' }, 
            { status: 403 }
        );
    }

    try {
        // Fetch all users
        const [rows] = await pool.query(
            'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC'
        );

        return NextResponse.json({ users: rows });

    } catch (err) {
        console.error('[GET USERS ERROR]', err);
        
        return NextResponse.json(
            { error: 'Server error.' }, 
            { status: 500 }
        );
    }
}

// CREATE USER 
export async function POST(request) {

    const session = await getSession();

    // Only admins allowed
    if (!session || session.role !== 'admin') {
        return NextResponse.json(
            { error: 'Unauthorised.' }, 
            { status: 403 }
        );
    }

    // Parse request body
    const body = await request.json();
    const { username, email, password, role = 'attendee' } = body;

    // Validate input (username, email, password)
    const regCheck = validateRegister({ username, email, password });

    if (!regCheck.valid) {
        return NextResponse.json(
            { error: regCheck.error }, 
            { status: 400 }
        );
    }

    // Validate role
    const roleCheck = validateRole(role);
    if (!roleCheck.valid) {
        return NextResponse.json(
            { error: roleCheck.error }, 
            { status: 400 }
        );
    }

    try {
        // Check for duplicates
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

        // Insert new user
        const [result] = await pool.query(
            'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [username, email, password_hash, role]
        );

        return NextResponse.json(
            { 
                message: 'User created.', 
                userId: result.insertId 
            }, 
            { status: 201 }
        );

    } catch (err) {
        console.error('[CREATE USER ERROR]', err);
        
        return NextResponse.json(
            { error: 'Server error.' }, 
            { status: 500 }
        );
    }
}