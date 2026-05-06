import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { validateEvent } from '@/lib/validation';

// GET /api/events/[id] — public
export async function GET(request, { params }) {
    const { id } = await params;

    try {
        const [rows] = await pool.query(
            `SELECT 
                e.*,
                u.username AS organiser_name,
                COUNT(b.id) AS booking_count,
                (e.max_attendees - COUNT(b.id)) AS spots_remaining
             FROM events e
             JOIN users u ON e.organiser_id = u.id
             LEFT JOIN bookings b ON b.event_id = e.id AND b.status = 'confirmed'
             WHERE e.id = ?
             GROUP BY e.id`,
            [id]
        );

        if (rows.length === 0) {
            return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
        }

        return NextResponse.json({ event: rows[0] });
    } catch (err) {
        console.error('[GET EVENT ERROR]', err);
        return NextResponse.json({ error: 'Server error.' }, { status: 500 });
    }
}

// PUT /api/events/[id] — organiser who owns it or admin
export async function PUT(request, { params }) {
    const { id } = await params;
    const session = await getSession();

    if (!session || !['organiser', 'admin'].includes(session.role)) {
        return NextResponse.json({ error: 'Unauthorised.' }, { status: 403 });
    }

    // Check ownership (organisers can only edit their own events)
    const [existing] = await pool.query('SELECT organiser_id FROM events WHERE id = ?', [id]);
    if (existing.length === 0) {
        return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
    }
    if (session.role === 'organiser' && existing[0].organiser_id !== session.userId) {
        return NextResponse.json({ error: 'Forbidden — not your event.' }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, event_type, date_time, duration_minutes, location, max_attendees, image_url } = body;

    const check = validateEvent({ title, event_type, date_time, max_attendees });
    if (!check.valid) {
        return NextResponse.json({ error: check.error }, { status: 400 });
    }

    try {
        await pool.query(
            `UPDATE events SET
                title = ?, description = ?, event_type = ?, date_time = ?,
                duration_minutes = ?, location = ?, max_attendees = ?, image_url = ?
             WHERE id = ?`,
            [title, description || null, event_type, date_time, duration_minutes || 60,
             location || null, max_attendees || 50, image_url || null, id]
        );

        return NextResponse.json({ message: 'Event updated.' });
    } catch (err) {
        console.error('[UPDATE EVENT ERROR]', err);
        return NextResponse.json({ error: 'Server error.' }, { status: 500 });
    }
}

// DELETE /api/events/[id] — organiser (own) or admin
export async function DELETE(request, { params }) {
    const { id } = await params;
    const session = await getSession();

    if (!session || !['organiser', 'admin'].includes(session.role)) {
        return NextResponse.json({ error: 'Unauthorised.' }, { status: 403 });
    }

    const [existing] = await pool.query('SELECT organiser_id FROM events WHERE id = ?', [id]);
    if (existing.length === 0) {
        return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
    }
    if (session.role === 'organiser' && existing[0].organiser_id !== session.userId) {
        return NextResponse.json({ error: 'Forbidden — not your event.' }, { status: 403 });
    }

    try {
        await pool.query('DELETE FROM events WHERE id = ?', [id]);
        return NextResponse.json({ message: 'Event deleted.' });
    } catch (err) {
        console.error('[DELETE EVENT ERROR]', err);
        return NextResponse.json({ error: 'Server error.' }, { status: 500 });
    }
}