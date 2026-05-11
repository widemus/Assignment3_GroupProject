"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// button for booking onto an event from the detail page
export default function BookButton({ eventId, isLoggedIn }) {
    // state variables for feedback messaging
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    const router = useRouter()

    // handles booking creation
    const handleBook = async () => {
        // send the user to login first if they aren't signed in
        if (!isLoggedIn) {
            router.push('/auth/login')
            return
        }

        setLoading(true)
        setMessage("")
        setError("")

        try {
            // post to the bookings endpoint
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ event_id: eventId }),
            })
            const data = await res.json()

            if (res.ok) {
                setMessage(`Booking ${data.status}.`)
                router.refresh() // refresh so capacity numbers update
            } else {
                setError(data.error || "Could not book event.")
            }
        } catch (err) {
            console.error(err)
            setError("Network error.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <button
                onClick={handleBook}
                disabled={loading}
                className="font-mono text-[11px] uppercase tracking-[0.22em] bg-ink text-mint px-6 py-3 hover:bg-accent disabled:opacity-50"
            >
                {loading ? "Booking..." : "Book this event →"}
            </button>

            {/* show feedback to the user */}
            {message && (
                <p className="font-mono text-[11px] text-ink-soft mt-3">{message}</p>
            )}
            {error && (
                <p className="font-mono text-[11px] text-accent mt-3">{error}</p>
            )}
        </div>
    )
}
