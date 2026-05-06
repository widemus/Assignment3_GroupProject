import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { validateEvent } from '@/lib/validation';

// GET SINGLE EVENT
export async function GET(request, { params }) {

    const { id } = await params;

    try {
        // Query event + organiser name + booking stats
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

        // Event not found
        if (rows.length === 0) {
            return NextResponse.json(
                { error: 'Event not found.' }, 
                { status: 404 }
            );
        }

        // Return event data
        return NextResponse.json({ event: rows[0] });

    } catch (err) {
        console.error('[GET EVENT ERROR]', err);

        return NextResponse.json(
            { error: 'Server error.' }, 
            { status: 500 }
        );
    }
}

// UPDATE EVENT
export async function PUT(request, { params }) {

    const { id } = await params;

    const session = await getSession();

    // Only organisers or admins allowed
    if (!session || !['organiser', 'admin'].includes(session.role)) {
        return NextResponse.json(
            { error: 'Unauthorised.' }, 
            { status: 403 }
        );
    }

    // Check ownership 
    const [existing] = await pool.query(
        'SELECT organiser_id FROM events WHERE id = ?', 
        [id]
    );

    // Event not found
    if (existing.length === 0) {
        return NextResponse.json(
            { error: 'Event not found.' }, 
            { status: 404 }
        );
    }

    // Organisers can only edit their own events
    if (session.role === 'organiser' && 
        existing[0].organiser_id !== session.userId
    ) {
        return NextResponse.json(
            { error: 'Forbidden — not your event.' }, 
            { status: 403 })
            ;
    }

    // Get updated data from request
    const body = await request.json();

    const { 
        title, 
        description, 
        event_type, 
        date_time, 
        duration_minutes, 
        location, 
        max_attendees, 
        image_url 
    } = body;

    // Validate input
    const check = validateEvent({ title, event_type, date_time, max_attendees });

    if (!check.valid) {
        return NextResponse.json(
            { error: check.error }, 
            { status: 400 }
        );
    }

    try {
        // Update event in database
        await pool.query(
            `UPDATE events SET
                title = ?, 
                description = ?, 
                event_type = ?, 
                date_time = ?,
                duration_minutes = ?, 
                location = ?, 
                max_attendees = ?, 
                image_url = ?
             WHERE id = ?`,
            [
                title, 
                description || null, 
                event_type, 
                date_time, 
                duration_minutes || 60,
                location || null, 
                max_attendees || 50, 
                image_url || null, 
                id
            ]
        );

        return NextResponse.json({ message: 'Event updated.' });

    } catch (err) {
        console.error('[UPDATE EVENT ERROR]', err);
        return NextResponse.json(
            { error: 'Server error.' }, 
            { status: 500 }
        );
    }
}

// DELETE EVENT
export async function DELETE(request, { params }) {

    const { id } = await params;

    const session = await getSession();

    // Only organisers/admins allowed   
    if (!session || !['organiser', 'admin'].includes(session.role)) {
        return NextResponse.json(
            { error: 'Unauthorised.' }, 
            { status: 403 }
        );
    }

    // Check ownership
    const [existing] = await pool.query(
        'SELECT organiser_id FROM events WHERE id = ?', 
        [id]
    );

    if (existing.length === 0) {
        return NextResponse.json(
            { error: 'Event not found.' }, 
            { status: 404 }
        );
    }

    // Organisers can delete only their own events
    if (session.role === 'organiser' && 
        existing[0].organiser_id !== session.userId) {
        return NextResponse.json(
            { error: 'Forbidden — not your event.' }, 
            { status: 403 }
        );
    }

    try {
        // Delete event
        await pool.query(
            'DELETE FROM events WHERE id = ?', 
            [id]
        );
        return NextResponse.json({ message: 'Event deleted.' });

    } catch (err) {
        console.error('[DELETE EVENT ERROR]', err);

        return NextResponse.json(
            { error: 'Server error.' }, 
            { status: 500 }
        );
    }
}