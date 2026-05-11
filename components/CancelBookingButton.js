"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// small button used to cancel a booking from the bookings list
export default function CancelBookingButton({ bookingId }) {
    // state variables for feedback
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const router = useRouter()

    // handles the cancel action
    const handleCancel = async () => {
        // confirm before destroying the booking
        if (!confirm("Cancel this booking?")) return

        setLoading(true)
        setError("")

        try {
            const res = await fetch(`/api/bookings/${bookingId}`, { method: 'DELETE' })
            if (res.ok) {
                router.refresh() // refresh so the cancelled row disappears
            } else {
                const data = await res.json()
                setError(data.error || "Could not cancel.")
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
                onClick={handleCancel}
                disabled={loading}
                className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent hover:underline disabled:opacity-50"
            >
                {loading ? "Cancelling..." : "Cancel"}
            </button>

            {error && (
                <p className="font-mono text-[11px] text-accent mt-1">{error}</p>
            )}
        </div>
    )
}
