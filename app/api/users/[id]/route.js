import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { validateRole } from '@/lib/validation';

// GET /api/users/[id] — admin only
export async function GET(request, { params }) {
    const { id } = await params;
    const session = await getSession();
    if (!session || session.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorised.' }, { status: 403 });
    }

    try {
        const [rows] = await pool.query(
            'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
            [id]
        );
        if (rows.length === 0) return NextResponse.json({ error: 'User not found.' }, { status: 404 });
        return NextResponse.json({ user: rows[0] });
    } catch (err) {
        console.error('[GET USER ERROR]', err);
        return NextResponse.json({ error: 'Server error.' }, { status: 500 });
    }
}

// PUT /api/users/[id] — admin edits role or resets password
export async function PUT(request, { params }) {
    const { id } = await params;
    const session = await getSession();
    if (!session || session.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorised.' }, { status: 403 });
    }

    const body = await request.json();
    const { role, password } = body;

    try {
        if (role !== undefined) {
            const check = validateRole(role);
            if (!check.valid) return NextResponse.json({ error: check.error }, { status: 400 });
            await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
        }

        if (password !== undefined) {
            if (password.length < 6) {
                return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
            }
            const hash = await bcrypt.hash(password, 10);
            await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [hash, id]);
        }

        return NextResponse.json({ message: 'User updated.' });
    } catch (err) {
        console.error('[UPDATE USER ERROR]', err);
        return NextResponse.json({ error: 'Server error.' }, { status: 500 });
    }
}

// DELETE /api/users/[id] — admin only; cannot delete themselves
export async function DELETE(request, { params }) {
    const { id } = await params;
    const session = await getSession();
    if (!session || session.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorised.' }, { status: 403 });
    }

    if (parseInt(id) === session.userId) {
        return NextResponse.json({ error: 'You cannot delete your own account.' }, { status: 400 });
    }

    try {
        const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return NextResponse.json({ error: 'User not found.' }, { status: 404 });
        }
        return NextResponse.json({ message: 'User deleted.' });
    } catch (err) {
        console.error('[DELETE USER ERROR]', err);
        return NextResponse.json({ error: 'Server error.' }, { status: 500 });
    }
}