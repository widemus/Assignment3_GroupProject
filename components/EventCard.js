import Link from 'next/link'
import Mono from './Mono'

// formats an iso date string into a short readable label
function formatDate(iso) {
    const d = new Date(iso)
    return d.toLocaleString('en-IE', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    })
}

// card used on the events list page
export default function EventCard({ event }) {

    // figure out spots remaining (api returns this as a string sometimes)
    const spots = Number(event.spots_remaining)
    const isFull = spots <= 0

    return (
        <Link
            href={`/events/${event.id}`}
            className="block border border-ink/15 p-8 hover:border-ink hover:bg-mint-soft transition-colors"
        >

            {/* type + date row */}
            <div className="flex justify-between items-baseline mb-4">
                <Mono>{event.event_type}</Mono>
                <Mono>{formatDate(event.date_time)}</Mono>
            </div>

            {/* event title */}
            <h3 className="font-serif text-2xl leading-tight mb-3">{event.title}</h3>

            {/* short description */}
            <p className="font-serif text-ink-soft leading-snug mb-6 line-clamp-3">
                {event.description}
            </p>

            {/* footer with capacity info */}
            <div className="flex justify-between items-baseline pt-4 border-t border-ink/10">
                <Mono>{event.organiser_name}</Mono>
                <Mono className={isFull ? 'text-accent' : ''}>
                    {isFull ? 'Full / waitlist' : `${spots} spots`}
                </Mono>
            </div>
        </Link>
    )
}
