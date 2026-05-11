import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import SectionLabel from '@/components/SectionLabel'
import Mono from '@/components/Mono'
import BookButton from '@/components/BookButton'
import { getSession } from '@/lib/auth'

// always render fresh so capacity is current
export const dynamic = 'force-dynamic'

// dynamic page metadata based on the event title
export async function generateMetadata({ params }) {
    const { id } = await params
    const event = await loadEvent(id)
    return { title: event ? event.title : 'Event' }
}

// formats an iso date string for display
function formatDate(iso) {
    return new Date(iso).toLocaleString('en-IE', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

// server-side fetcher for a single event
async function loadEvent(id) {
    const host = (await headers()).get('host')
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const res = await fetch(`${protocol}://${host}/api/events/${id}`, { cache: 'no-store' })
    if (!res.ok) return null
    const data = await res.json()
    return data.event
}

export default async function EventDetailPage({ params }) {
    const { id } = await params

    // load event and session at the same time
    const [event, session] = await Promise.all([loadEvent(id), getSession()])

    // 404 if the event doesn't exist
    if (!event) notFound()

    // figure out who can edit this event
    const canEdit = session && (
        session.role === 'admin' ||
        (session.role === 'organiser' && event.organiser_id === session.userId)
    )

    return (
        <div className="pt-40 pb-32 px-8">
            <div className="max-w-[1100px] mx-auto">

                {/* breadcrumb back to list */}
                <Link href="/events" className="font-mono text-[11px] uppercase tracking-[0.22em] hover:text-accent">
                    ← Back to events
                </Link>

                <div className="mt-8">
                    <SectionLabel index={1} jp={event.event_type === 'webinar' ? '配信' : '見学'} en={event.event_type} />

                    {/* event title */}
                    <h1 className="font-serif text-5xl md:text-6xl leading-[1.05] tracking-tight">
                        {event.title}
                    </h1>

                    {/* meta row */}
                    <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <Mono>When</Mono>
                            <p className="font-serif mt-1">{formatDate(event.date_time)}</p>
                        </div>
                        <div>
                            <Mono>Duration</Mono>
                            <p className="font-serif mt-1">{event.duration_minutes} min</p>
                        </div>
                        <div>
                            <Mono>Where</Mono>
                            <p className="font-serif mt-1 break-words">{event.location || 'TBA'}</p>
                        </div>
                        <div>
                            <Mono>Capacity</Mono>
                            <p className="font-serif mt-1">
                                {event.spots_remaining > 0
                                    ? `${event.spots_remaining} spots left`
                                    : 'Full / waitlist'}
                            </p>
                        </div>
                    </div>

                    <div className="hairline my-12" />

                    {/* full description */}
                    <p className="font-serif text-2xl text-ink-soft leading-snug max-w-3xl">
                        {event.description}
                    </p>

                    {/* organiser line */}
                    <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-mute">
                        Organised by {event.organiser_name}
                    </p>

                    {/* action area */}
                    <div className="mt-12 flex items-center gap-6">
                        <BookButton eventId={event.id} isLoggedIn={!!session} />

                        {/* edit link only for owner / admin */}
                        {canEdit && (
                            <Link
                                href={`/events/edit/${event.id}`}
                                className="font-mono text-[11px] uppercase tracking-[0.22em] underline hover:text-accent"
                            >
                                Edit event
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
