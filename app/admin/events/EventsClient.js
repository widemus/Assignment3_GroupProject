"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import SectionLabel from '@/components/SectionLabel'
import Mono from '@/components/Mono'

// formats an iso date string for display
function formatDate(iso) {
    return new Date(iso).toLocaleString('en-IE', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export default function EventsClient() {
    // state variables for the events list and feedback
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    // function to fetch all events from the public endpoint
    const fetchEvents = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/events', { cache: 'no-store' })
            const data = await res.json()
            if (res.ok) {
                setEvents(data.events || [])
            } else {
                setError(data.error || "Could not load events.")
            }
        } catch (err) {
            console.error(err)
            setError("Network error.")
        } finally {
            setLoading(false)
        }
    }

    // load events on first render
    useEffect(() => {
        fetchEvents()
    }, [])

    // handles deleting an event from the table
    const handleDelete = async (id) => {
        if (!confirm("Delete this event?")) return // confirm before destroying

        try {
            const res = await fetch(`/api/events/${id}`, { method: 'DELETE' })
            if (res.ok) fetchEvents()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="pt-40 pb-32 px-8">
            <div className="max-w-[1200px] mx-auto">

                <div className="flex items-end justify-between mb-12">
                    <div>
                        <SectionLabel index={1} jp="日程" en="Programme" />
                        <h1 className="font-serif text-5xl leading-tight">All events</h1>
                    </div>
                    <Link
                        href="/events/create"
                        className="font-mono text-[11px] uppercase tracking-[0.22em] bg-ink text-mint px-4 py-3 hover:bg-accent"
                    >
                        + New event
                    </Link>
                </div>

                {/* show fetch error if any */}
                {error && (
                    <p className="font-mono text-[11px] text-accent mb-8">{error}</p>
                )}

                {/* loading state */}
                {loading ? (
                    <p className="font-mono text-[11px] text-ink-mute">Loading...</p>
                ) : (
                    <div className="border-t border-ink/15">

                        {/* table header */}
                        <div className="grid grid-cols-12 gap-4 py-3 border-b border-ink/15">
                            <div className="col-span-1"><Mono>ID</Mono></div>
                            <div className="col-span-2"><Mono>Type</Mono></div>
                            <div className="col-span-4"><Mono>Title</Mono></div>
                            <div className="col-span-2"><Mono>When</Mono></div>
                            <div className="col-span-1"><Mono>Capacity</Mono></div>
                            <div className="col-span-2 text-right"><Mono>Actions</Mono></div>
                        </div>

                        {/* table rows */}
                        {events.map(ev => (
                            <div key={ev.id} className="grid grid-cols-12 gap-4 py-4 border-b border-ink/10 items-center">
                                <div className="col-span-1 font-mono text-[11px]">{ev.id}</div>
                                <div className="col-span-2 font-mono text-[11px] uppercase">{ev.event_type}</div>
                                <div className="col-span-4 font-serif">{ev.title}</div>
                                <div className="col-span-2 font-mono text-[11px]">{formatDate(ev.date_time)}</div>
                                <div className="col-span-1 font-mono text-[11px]">
                                    {ev.booking_count}/{ev.max_attendees}
                                </div>
                                <div className="col-span-2 text-right space-x-4">
                                    <Link
                                        href={`/events/edit/${ev.id}`}
                                        className="font-mono text-[11px] uppercase tracking-[0.22em] hover:text-accent"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(ev.id)}
                                        className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent hover:underline"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
