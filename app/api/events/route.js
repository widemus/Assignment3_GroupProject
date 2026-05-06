import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { validateEvent } from '@/lib/validation';

// GET /api/events — public, returns all events with organiser name + booking count
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');       
    const available = searchParams.get('available'); 

    try {
        let query = `
            SELECT 
                e.*,
                u.username AS organiser_name,
                COUNT(b.id) AS booking_count,
                (e.max_attendees - COUNT(b.id)) AS spots_remaining
            FROM events e
            JOIN users u ON e.organiser_id = u.id
            LEFT JOIN bookings b ON b.event_id = e.id AND b.status = 'confirmed'
            WHERE e.date_time > NOW()
        `;
        const params = [];

        if (type) {
            query += ' AND e.event_type = ?';
            params.push(type);
        }

        query += ' GROUP BY e.id ORDER BY e.date_time ASC';

        const [rows] = await pool.query(query, params);

        let results = rows;
        if (available === 'true') {
            results = rows.filter(r => r.spots_remaining > 0);
        }

        return NextResponse.json({ events: results });
    } catch (err) {
        console.error('[GET EVENTS ERROR]', err);
        return NextResponse.json({ error: 'Server error.' }, { status: 500 });
    }
}

// POST /api/events — organisers and admins only
export async function POST(request) {
    const session = await getSession();
    if (!session || !['organiser', 'admin'].includes(session.role)) {
        return NextResponse.json({ error: 'Unauthorised.' }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, event_type, date_time, duration_minutes, location, max_attendees, image_url } = body;

    const check = validateEvent({ title, event_type, date_time, max_attendees });
    if (!check.valid) {
        return NextResponse.json({ error: check.error }, { status: 400 });
    }

    try {
        const [result] = await pool.query(
            `INSERT INTO events 
             (title, description, event_type, date_time, duration_minutes, location, max_attendees, organiser_id, image_url)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                title,
                description || null,
                event_type,
                date_time,
                duration_minutes || 60,
                location || null,
                max_attendees || 50,
                session.userId,
                image_url || null,
            ]
        );

        return NextResponse.json(
            { message: 'Event created.', eventId: result.insertId },
            { status: 201 }
        );
    } catch (err) {
        console.error('[CREATE EVENT ERROR]', err);
        return NextResponse.json({ error: 'Server error.' }, { status: 500 });
    }
}