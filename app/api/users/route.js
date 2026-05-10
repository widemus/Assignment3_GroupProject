import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';
import { validateRegister, validateRole } from '@/lib/validation';

// Returns a list of all registered users, ordered by newest first
export async function GET() {
    const adminSession = await getSession();

    // Restrict access to admins only
    if (!adminSession || adminSession.role !== 'admin') {
        return NextResponse.json(
            { message: 'Access denied: Admin privileges required' },
            { status: 403 }
        );
    }
    try {
        const fetchAllSql = 'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC';
        const [userList] = await db.query(fetchAllSql);

        return NextResponse.json({
            status: 'Success',
            data: userList
        });

    } catch(err) {
        console.error('Admin fetch users error:', err);
        return NextResponse.json(
            { message: 'Failed to load user directory' },
            { status: 500 }
        );
    }
}

// Allows admin to create a new user with any role
export async function POST(req) {
    const adminCheck = await getSession();

    // Restrict access to admins only
    if (!adminCheck || adminCheck.role !== 'admin') {
        return NextResponse.json(
            { message: 'Action not permitted' },
            { status: 403 }
        );
    }

    const newUserDetails = await req.json();
    const { username, email, password, role = 'attendee' } = newUserDetails;

    // Validate input fields
    const isDataValid = validateRegister({ username, email, password });

    if (!isDataValid.valid) {
        return NextResponse.json(
            { message: isDataValid.error },
            { status: 400 }
        );
    }

    // Validate that the role is one of the allowed values
    const isRoleValid = validateRole(role);

    if (!isRoleValid.valid) {
        return NextResponse.json(
            { message: isRoleValid.error },
            { status: 400 }
        );
    }

    try {
        // Check for duplicate email or username
        const [duplicate] = await db.query('SELECT id FROM users WHERE email = ? OR username = ?', [email, username]);

        if (duplicate.length > 0) {
            return NextResponse.json(
                { message: 'User with this email or username already exists' },
                { status: 409 }
            );
        }

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 12);
        
        const insertSql = 'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)';
        const [exeResult] = await db.query(insertSql, [username, email, hashedPassword, role]);

        return NextResponse.json(
            {
                message: 'New user added by admin',
                newId: exeResult.insertId
            },
            { status: 201 }
        );
    } catch(err) {
        console.error('Admin create user error:', err);
        return NextResponse.json(
            { message: 'System error while adding user' },
            { status: 500 }
        );
    }
}