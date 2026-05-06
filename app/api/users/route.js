import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { validateRegister, validateRole } from '@/lib/validation';

// GET /api/users — admin only
export async function GET() {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorised.' }, { status: 403 });
    }

    try {
        const [rows] = await pool.query(
            'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC'
        );
        return NextResponse.json({ users: rows });
    } catch (err) {
        console.error('[GET USERS ERROR]', err);
        return NextResponse.json({ error: 'Server error.' }, { status: 500 });
    }
}

// POST /api/users — admin creates a user with any role
export async function POST(request) {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorised.' }, { status: 403 });
    }

    const body = await request.json();
    const { username, email, password, role = 'attendee' } = body;

    const regCheck = validateRegister({ username, email, password });
    if (!regCheck.valid) return NextResponse.json({ error: regCheck.error }, { status: 400 });

    const roleCheck = validateRole(role);
    if (!roleCheck.valid) return NextResponse.json({ error: roleCheck.error }, { status: 400 });

    try {
        const [existing] = await pool.query(
            'SELECT id FROM users WHERE email = ? OR username = ?',
            [email, username]
        );
        if (existing.length > 0) {
            return NextResponse.json({ error: 'Email or username already in use.' }, { status: 409 });
        }

        const password_hash = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [username, email, password_hash, role]
        );

        return NextResponse.json({ message: 'User created.', userId: result.insertId }, { status: 201 });
    } catch (err) {
        console.error('[CREATE USER ERROR]', err);
        return NextResponse.json({ error: 'Server error.' }, { status: 500 });
    }
}