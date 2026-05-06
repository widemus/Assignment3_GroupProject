import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET BOOKING BY ID 
export async function GET(request, { params }) {

    // Extract booking ID from URL
    const { id } = await params;

     // Check if user is logged in
    const session = await getSession();
    if (!session) {
        return NextResponse.json(
            { error: 'Unauthorised.' }, 
            { status: 401 }
        );
    }

    try {
        // Get booking + related event info
        const [rows] = await pool.query(
            `SELECT b.*, e.title, e.event_type, e.date_time 
             FROM bookings b JOIN events e ON b.event_id = e.id
             WHERE b.id = ?`,
            [id]
        );

        // Booking not found
        if (rows.length === 0) {
            return NextResponse.json(
                { error: 'Booking not found.' }, 
                { status: 404 }
            );
        }

        const booking = rows[0];
        // Access control:
        // - Admins can view any booking
        // - Regular users can only view their own
        if (session.role !== 'admin' && booking.user_id !== session.userId) {
            return NextResponse.json(
                { error: 'Forbidden.' }, 
                { status: 403 }
            );
        }

        // Return booking data
        return NextResponse.json({ booking });

    } catch (err) {
        console.error('[GET BOOKING ERROR]', err);
        return NextResponse.json(
            { error: 'Server error.' }, 
            { status: 500 }
        );
    }
}

// UPDATE BOOKING STATUS
export async function PUT(request, { params }) {

    const { id } = await params;

    // Only admins allowed
    const session = await getSession();
    if (!session || session.role !== 'admin') {
        return NextResponse.json(
            { error: 'Unauthorised.' }, 
            { status: 403 }
        );
    }

     // Read request body
    const body = await request.json();
    const { status } = body;

     // Validate allowed status values
    if (!['confirmed', 'cancelled', 'waitlisted'].includes(status)) {
        return NextResponse.json(
            { error: 'Invalid status.' }, 
            { status: 400 }
        );
    }

    try {
         // Update booking status
        const [result] = await pool.query(
            'UPDATE bookings SET status = ? WHERE id = ?',
            [status, id]
        );

        // If no rows updated - booking doesn't exist
        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: 'Booking not found.' }, 
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Booking updated.' });

    } catch (err) {
        console.error('[UPDATE BOOKING ERROR]', err);
        return NextResponse.json(
            { error: 'Server error.' }, 
            { status: 500 }
        );
    }
}

// DELETE BOOKING
export async function DELETE(request, { params }) {

    const { id } = await params;

    const session = await getSession();
    if (!session) {
        return NextResponse.json(
            { error: 'Unauthorised.' }, 
            { status: 401 }
        );
    }

    try {
        // Check who owns the booking
        const [rows] = await pool.query(
            'SELECT user_id FROM bookings WHERE id = ?', 
            [id]
        );

        // Booking not found
        if (rows.length === 0) {
            return NextResponse.json(
                { error: 'Booking not found.' }, 
                { status: 404 }
            );
        }

        // Access control:
        // - Admins can delete any booking
        // - Users can delete only their own
        if (session.role !== 'admin' && rows[0].user_id !== session.userId) {
            return NextResponse.json(
                { error: 'Forbidden.' }, 
                { status: 403 }
            );
        }

         // Delete booking
        await pool.query(
            'DELETE FROM bookings WHERE id = ?', 
            [id]
        );
        return NextResponse.json({ message: 'Booking cancelled.' });

    } catch (err) {
        console.error('[DELETE BOOKING ERROR]', err);

        return NextResponse.json(
            { error: 'Server error.' }, 
            { status: 500 });
    }
}