import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET /api/bookings — returns the current user's bookings with event details
export async function GET() {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorised.' }, { status: 401 });
    }

    try {
        const [rows] = await pool.query(
            `SELECT 
                b.id, b.status, b.booked_at,
                e.id AS event_id, e.title, e.event_type, e.date_time,
                e.duration_minutes, e.location, e.image_url
             FROM bookings b
             JOIN events e ON b.event_id = e.id
             WHERE b.user_id = ?
             ORDER BY e.date_time ASC`,
            [session.userId]
        );

        return NextResponse.json({ bookings: rows });
    } catch (err) {
        console.error('[GET BOOKINGS ERROR]', err);
        return NextResponse.json({ error: 'Server error.' }, { status: 500 });
    }
}

// POST /api/bookings — attendees book an event
export async function POST(request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorised.' }, { status: 401 });
    }

    const body = await request.json();
    const { event_id } = body;

    if (!event_id) {
        return NextResponse.json({ error: 'event_id is required.' }, { status: 400 });
    }

    try {
        // Check event exists and is in the future
        const [events] = await pool.query(
            'SELECT id, max_attendees, date_time FROM events WHERE id = ?',
            [event_id]
        );
        if (events.length === 0) {
            return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
        }
        const event = events[0];
        if (new Date(event.date_time) <= new Date()) {
            return NextResponse.json({ error: 'Cannot book a past event.' }, { status: 400 });
        }

        // Check for duplicate booking
        const [dupe] = await pool.query(
            'SELECT id FROM bookings WHERE event_id = ? AND user_id = ?',
            [event_id, session.userId]
        );
        if (dupe.length > 0) {
            return NextResponse.json({ error: 'You have already booked this event.' }, { status: 409 });
        }

        // Check capacity
        const [countRows] = await pool.query(
            "SELECT COUNT(*) AS count FROM bookings WHERE event_id = ? AND status = 'confirmed'",
            [event_id]
        );
        const confirmedCount = countRows[0].count;
        const status = confirmedCount >= event.max_attendees ? 'waitlisted' : 'confirmed';

        const [result] = await pool.query(
            'INSERT INTO bookings (event_id, user_id, status) VALUES (?, ?, ?)',
            [event_id, session.userId, status]
        );

        return NextResponse.json(
            { message: `Booking ${status}.`, bookingId: result.insertId, status },
            { status: 201 }
        );
    } catch (err) {
        console.error('[CREATE BOOKING ERROR]', err);
        return NextResponse.json({ error: 'Server error.' }, { status: 500 });
    }
}