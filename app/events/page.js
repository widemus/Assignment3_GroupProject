import { headers } from 'next/headers'
import SectionLabel from '@/components/SectionLabel'
import EventCard from '@/components/EventCard'
import EventFilters from '@/components/EventFilters'
import { getSession } from '@/lib/auth'
import Link from 'next/link'

// page metadata for the events list
export const metadata = {
    title: 'Events // NeuraCortex',
    description: 'Webinars and lab excursions, open to the public.',
}

// disable static caching so filters always run fresh against the api
export const dynamic = 'force-dynamic'

// server-side data fetcher that calls our own events api with filters
async function loadEvents(searchParams) {
    // build query string from current filters
    const params = new URLSearchParams()
    if (searchParams?.type) params.set('type', searchParams.type)
    if (searchParams?.available) params.set('available', searchParams.available)

    // need an absolute url on the server, so reuse the request host
    const host = (await headers()).get('host')
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const url = `${protocol}://${host}/api/events?${params.toString()}`

    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return []

    const data = await res.json()
    return data.events || []
}

export default async function EventsPage({ searchParams }) {
    // next 15+ requires awaiting searchParams
    const sp = await searchParams

    // load events list and current session in parallel
    const [events, session] = await Promise.all([
        loadEvents(sp),
        getSession(),
    ])

    // organisers and admins can create new events
    const canCreate = session && ['organiser', 'admin'].includes(session.role)

    return (
        <div className="pt-40 pb-32 px-8">
            <div className="max-w-[1400px] mx-auto">

                {/* heading row with optional create button */}
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <SectionLabel index={1} jp="案内" en="Public Programme" />
                        <h1 className="font-serif text-6xl leading-[1.02] tracking-tight">
                            Upcoming events
                        </h1>
                    </div>

                    {canCreate && (
                        <Link
                            href="/events/create"
                            className="font-mono text-[11px] uppercase tracking-[0.22em] bg-ink text-mint px-4 py-3 hover:bg-accent"
                        >
                            + New event
                        </Link>
                    )}
                </div>

                {/* filter bar */}
                <EventFilters />

                {/* events grid or empty state */}
                {events.length === 0 ? (
                    <p className="font-serif text-ink-soft text-xl">
                        No events match your filters yet.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map(ev => (
                            <EventCard key={ev.id} event={ev} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
