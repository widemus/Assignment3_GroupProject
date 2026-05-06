import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { validateEvent } from '@/lib/validation';

// GET ALL EVENTS
export async function GET(request) {

    // Extract query parameters from URL
    const { searchParams } = new URL(request.url);

    // filter by event type
    const type = searchParams.get('type');     
    
    // filter available only
    const available = searchParams.get('available'); 

    try {
         // Base query: future events only
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

        // Filter: event type
        if (type) {
            query += ' AND e.event_type = ?';
            params.push(type);
        }

        // Group and sort
        query += ' GROUP BY e.id ORDER BY e.date_time ASC';

        // Execute query
        const [rows] = await pool.query(query, params);

        let results = rows;

        // Only events with available spots
        if (available === 'true') {
            results = rows.filter(r => r.spots_remaining > 0);
        }

        return NextResponse.json({ events: results });

    } catch (err) {
        console.error('[GET EVENTS ERROR]', err);

        return NextResponse.json(
            { error: 'Server error.' }, 
            { status: 500 }
        );
    }
}

// CREATE EVENT
export async function POST(request) {

    const session = await getSession();

    // Only organisers or admins can create events
    if (!session || !['organiser', 'admin'].includes(session.role)) {
        return NextResponse.json(
            { error: 'Unauthorised.' }, 
            { status: 403 }
        );
    }

    const body = await request.json();

    const { 
        title, 
        description, 
        event_type, 
        date_time, 
        duration_minutes, 
        location, max_attendees, 
        image_url 
    } = body;

    // Validate input
    const check = validateEvent({ 
        title, 
        event_type, 
        date_time, 
        max_attendees 
    });

    if (!check.valid) {
        return NextResponse.json(
            { error: check.error }, 
            { status: 400 }
        );
    }

    try {
        // Insert new event into db
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
            { 
                message: 'Event created.', 
                eventId: result.insertId 
            },
            { status: 201 }
        );
    } catch (err) {
        console.error('[CREATE EVENT ERROR]', err);

        return NextResponse.json(
            { error: 'Server error.' }, 
            { status: 500 }
        );
    }
}