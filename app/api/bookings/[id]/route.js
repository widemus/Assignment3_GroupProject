import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET /api/bookings/[id]
export async function GET(request, { params }) {
    const { id } = await params;
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorised.' }, { status: 401 });

    try {
        const [rows] = await pool.query(
            `SELECT b.*, e.title, e.event_type, e.date_time 
             FROM bookings b JOIN events e ON b.event_id = e.id
             WHERE b.id = ?`,
            [id]
        );
        if (rows.length === 0) return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });

        const booking = rows[0];
        // Users can only see their own bookings; admins can see all
        if (session.role !== 'admin' && booking.user_id !== session.userId) {
            return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
        }

        return NextResponse.json({ booking });
    } catch (err) {
        console.error('[GET BOOKING ERROR]', err);
        return NextResponse.json({ error: 'Server error.' }, { status: 500 });
    }
}

// PUT /api/bookings/[id] — update status (admin only)
export async function PUT(request, { params }) {
    const { id } = await params;
    const session = await getSession();
    if (!session || session.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorised.' }, { status: 403 });
    }

    const body = await request.json();
    const { status } = body;

    if (!['confirmed', 'cancelled', 'waitlisted'].includes(status)) {
        return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
    }

    try {
        const [result] = await pool.query(
            'UPDATE bookings SET status = ? WHERE id = ?',
            [status, id]
        );
        if (result.affectedRows === 0) {
            return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Booking updated.' });
    } catch (err) {
        console.error('[UPDATE BOOKING ERROR]', err);
        return NextResponse.json({ error: 'Server error.' }, { status: 500 });
    }
}

// DELETE /api/bookings/[id] — users cancel their own; admins cancel any
export async function DELETE(request, { params }) {
    const { id } = await params;
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorised.' }, { status: 401 });

    try {
        const [rows] = await pool.query('SELECT user_id FROM bookings WHERE id = ?', [id]);
        if (rows.length === 0) return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });

        if (session.role !== 'admin' && rows[0].user_id !== session.userId) {
            return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
        }

        await pool.query('DELETE FROM bookings WHERE id = ?', [id]);
        return NextResponse.json({ message: 'Booking cancelled.' });
    } catch (err) {
        console.error('[DELETE BOOKING ERROR]', err);
        return NextResponse.json({ error: 'Server error.' }, { status: 500 });
    }
}