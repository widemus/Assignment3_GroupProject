import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import SectionLabel from '@/components/SectionLabel'
import Mono from '@/components/Mono'
import StatusTag from '@/components/StatusTag'
import CancelBookingButton from '@/components/CancelBookingButton'
import { getSession } from '@/lib/auth'

// always render fresh
export const dynamic = 'force-dynamic'

// page metadata for the bookings page
export const metadata = {
    title: 'My bookings // NeuraCortex',
}

// formats an iso date string for display
function formatDate(iso) {
    return new Date(iso).toLocaleString('en-IE', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    })
}

// server-side fetcher that forwards the cookie so our api recognises us
async function loadBookings() {
    const h = await headers()
    const host = h.get('host')
    const cookie = h.get('cookie') || ''
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const res = await fetch(`${protocol}://${host}/api/bookings`, {
        headers: { cookie },
        cache: 'no-store',
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.bookings || []
}

export default async function BookingsPage() {
    // require login to see this page
    const session = await getSession()
    if (!session) redirect('/auth/login')

    // load bookings for the current user
    const bookings = await loadBookings()

    return (
        <div className="pt-40 pb-32 px-8">
            <div className="max-w-[1100px] mx-auto">

                <SectionLabel index={1} jp="予約" en="My bookings" />

                <h1 className="font-serif text-6xl mb-12 leading-[1.02] tracking-tight">
                    Your reservations
                </h1>

                {/* empty state */}
                {bookings.length === 0 ? (
                    <p className="font-serif text-xl text-ink-soft">
                        You haven't booked anything yet.{" "}
                        <Link href="/events" className="underline hover:text-accent">
                            Browse upcoming events
                        </Link>.
                    </p>
                ) : (
                    <div className="border-t border-ink/15">
                        {bookings.map(b => (
                            <div
                                key={b.id}
                                className="grid grid-cols-12 gap-4 items-baseline border-b border-ink/15 py-6"
                            >
                                <div className="col-span-12 md:col-span-2">
                                    <Mono>{b.event_type}</Mono>
                                    <p className="font-mono text-[11px] mt-1">{formatDate(b.date_time)}</p>
                                </div>

                                <div className="col-span-12 md:col-span-6">
                                    <Link href={`/events/${b.event_id}`} className="font-serif text-2xl hover:text-accent">
                                        {b.title}
                                    </Link>
                                    {b.location && (
                                        <p className="font-mono text-[11px] text-ink-mute mt-1">{b.location}</p>
                                    )}
                                </div>

                                <div className="col-span-6 md:col-span-2">
                                    <StatusTag status={b.status} />
                                </div>

                                <div className="col-span-6 md:col-span-2 text-right">
                                    <CancelBookingButton bookingId={b.id} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
