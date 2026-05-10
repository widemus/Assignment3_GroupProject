import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';
import { validateRole } from '@/lib/validation';

// Returns a single user by ID
export async function GET(request, { params }) {
    const { id } = await params;
    const adminCheck = await getSession();

    // Restrict access to admins only
    if (!adminCheck || adminCheck.role !== 'admin') {
        return NextResponse.json(
            { message: 'Unauthorized access' },
            { status: 403 }
        );
    }

    try {
        const fetchUserSql = 'SELECT id, username, email, role, created_at FROM users WHERE id = ?';
        const [results] = await db.query(fetchUserSql, [id]);

        if (results.length === 0) {
            return NextResponse.json(
                { message: 'User record not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { account: results[0] }
        );
    } catch(err) {
        console.error('Fetch user error:', err);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Allows admin to update a user's role or password
export async function PUT(request, { params }) {
    const { id } = await params;
    const adminCheck = await getSession();

    // Restrict access to admins only
    if (!adminCheck || adminCheck.role !== 'admin') {
        return NextResponse.json(
            { message: 'Unauthorized access' },
            { status: 403 }
        );
    }

    const updateData = await request.json();
    const { role, password } = updateData;
    try {

        // Update role if provided
        if (role !== undefined) {
            const roleValid = validateRole(role);

            if (!roleValid.valid) {
                return NextResponse.json(
                    { message: roleValid.error },
                    { status: 400 }
                );
            }
            
            await db.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
        }

        // Update password if provided
        if (password !== undefined) {

            if (password.length < 6) {
                return NextResponse.json(
                    { message: 'Password must be at least 6 characters' },
                    { status: 400 }
                );
            }

            const newHashPassword = await bcrypt.hash(password, 12);
            await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [newHashPassword, id]);
        }

        return NextResponse.json({
            status: 'Success',
            message: 'Account updated'
        });
    } catch(err) {
        console.error('Update user error:', err);
        return NextResponse.json(
            { message: 'Database error during update' },
            { status: 500 }
        );
    }
}

// Deletes a user by ID, admin cannot delete their own account
export async function DELETE(request, { params }) {
    const { id } = await params;
    const adminCheck = await getSession();

    // Restrict access to admins only
    if (!adminCheck || adminCheck.role !== 'admin') {
        return NextResponse.json(
            { message: 'Unauthorized access' },
            { status: 403 }
        );
    }

    // Prevent admin from deleting their own account
    if (parseInt(id) === adminCheck.userId) {
        return NextResponse.json(
            { message: 'Self-deletion is blocked' },
            { status: 400 }
        );
    }
    try {
        const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);

        // No user found
        if (result.affectedRows === 0) {
            return NextResponse.json(
                { message: 'User does not exist' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'User deleted from the system' }
        );
    } catch(err) {
        console.error('Delete user error:', err);
        return NextResponse.json(
            { message: 'Server error during deletion' },
            { status: 500 }
        );
    }
}