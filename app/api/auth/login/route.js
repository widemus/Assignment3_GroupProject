import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { setSession } from '@/lib/auth';
import { validateLogin } from '@/lib/validation';

export async function POST(request) {
    const body = await request.json();
    const { email, password } = body;

    const check = validateLogin({ email, password });
    if (!check.valid) {
        return NextResponse.json({ error: check.error }, { status: 400 });
    }

    try {
        const [rows] = await pool.query(
            'SELECT id, username, password_hash, role FROM users WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
        }

        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
        }

        await setSession({ userId: user.id, role: user.role, username: user.username });

        return NextResponse.json({
            message: 'Login successful.',
            userId: user.id,
            role: user.role,
            username: user.username,
        });
    } catch (err) {
        console.error('[LOGIN ERROR]', err);
        return NextResponse.json({ error: 'Server error.' }, { status: 500 });
    }
}