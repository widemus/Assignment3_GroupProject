"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// reusable form for creating or editing an event
export default function EventForm({ initial = null, mode = 'create' }) {
    // state variables to control form inputs
    const [title, setTitle] = useState(initial?.title || "")
    const [description, setDescription] = useState(initial?.description || "")
    const [eventType, setEventType] = useState(initial?.event_type || "webinar")
    // datetime-local needs a YYYY-MM-DDTHH:mm string
    const [dateTime, setDateTime] = useState(
        initial?.date_time ? new Date(initial.date_time).toISOString().slice(0, 16) : ""
    )
    const [duration, setDuration] = useState(initial?.duration_minutes || 60)
    const [location, setLocation] = useState(initial?.location || "")
    const [maxAttendees, setMaxAttendees] = useState(initial?.max_attendees || 50)
    const [imageUrl, setImageUrl] = useState(initial?.image_url || "")

    // state variables for displaying feedback to the user
    const [error, setError] = useState("")
    const [submitting, setSubmitting] = useState(false)

    const router = useRouter()

    // handles form submission for both create and edit modes
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("") // reset error on new submission
        setSubmitting(true)

        // figure out the right endpoint and method based on mode
        const url = mode === 'edit'
            ? `/api/events/${initial.id}`
            : '/api/events'
        const method = mode === 'edit' ? 'PUT' : 'POST'

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description,
                    event_type: eventType,
                    date_time: dateTime,
                    duration_minutes: Number(duration),
                    location,
                    max_attendees: Number(maxAttendees),
                    image_url: imageUrl,
                }),
            })
            const data = await res.json()

            if (res.ok) {
                // navigate back to the events list on success
                router.push('/events')
                router.refresh()
            } else {
                setError(data.error || data.message || "Could not save event.")
            }
        } catch (err) {
            console.error(err)
            setError("Network error.")
        } finally {
            setSubmitting(false)
        }
    }

    // handles deleting the event in edit mode
    const handleDelete = async () => {
        if (!confirm("Delete this event for good?")) return // ask before destroying

        try {
            const res = await fetch(`/api/events/${initial.id}`, { method: 'DELETE' })
            if (res.ok) {
                router.push('/events')
                router.refresh()
            } else {
                const data = await res.json()
                setError(data.error || "Could not delete event.")
            }
        } catch (err) {
            console.error(err)
            setError("Network error.")
        }
    }

    // shared label and field styles
    const labelCls = "font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute block mb-2"
    const fieldCls = "w-full bg-transparent border-b border-ink/40 py-2 font-serif text-lg focus:outline-none focus:border-ink"

    return (
        <form onSubmit={handleSubmit} className="space-y-8">

            <div>
                <label className={labelCls}>Title</label>
                <input className={fieldCls} type="text" required value={title} onChange={e => setTitle(e.target.value)} />
            </div>

            <div>
                <label className={labelCls}>Description</label>
                <textarea className={`${fieldCls} resize-none`} rows={4} value={description} onChange={e => setDescription(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label className={labelCls}>Type</label>
                    <select className={fieldCls} value={eventType} onChange={e => setEventType(e.target.value)}>
                        <option value="webinar">Webinar</option>
                        <option value="excursion">Excursion</option>
                    </select>
                </div>

                <div>
                    <label className={labelCls}>Date & time</label>
                    <input className={fieldCls} type="datetime-local" required value={dateTime} onChange={e => setDateTime(e.target.value)} />
                </div>

                <div>
                    <label className={labelCls}>Duration (minutes)</label>
                    <input className={fieldCls} type="number" min={1} value={duration} onChange={e => setDuration(e.target.value)} />
                </div>

                <div>
                    <label className={labelCls}>Max attendees</label>
                    <input className={fieldCls} type="number" min={1} value={maxAttendees} onChange={e => setMaxAttendees(e.target.value)} />
                </div>
            </div>

            <div>
                <label className={labelCls}>Location or meeting link</label>
                <input className={fieldCls} type="text" value={location} onChange={e => setLocation(e.target.value)} />
            </div>

            <div>
                <label className={labelCls}>Image URL (optional)</label>
                <input className={fieldCls} type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
            </div>

            {/* show error feedback */}
            {error && (
                <p className="font-mono text-[11px] text-accent">{error}</p>
            )}

            {/* action row: save and delete */}
            <div className="flex items-center gap-6 pt-6 border-t border-ink/15">
                <button
                    type="submit"
                    disabled={submitting}
                    className="font-mono text-[11px] uppercase tracking-[0.22em] bg-ink text-mint px-6 py-3 hover:bg-accent disabled:opacity-50"
                >
                    {submitting ? "Saving..." : (mode === 'edit' ? "Save changes →" : "Create event →")}
                </button>

                {mode === 'edit' && (
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent hover:underline"
                    >
                        Delete event
                    </button>
                )}
            </div>
        </form>
    )
}
