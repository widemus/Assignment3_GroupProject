import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import EventForm from '@/components/EventForm'
import SectionLabel from '@/components/SectionLabel'
import { getSession } from '@/lib/auth'

// always render fresh
export const dynamic = 'force-dynamic'

// page metadata for the edit event page
export const metadata = {
    title: 'Edit event',
}

// fetch a single event from our own api
async function loadEvent(id) {
    const host = (await headers()).get('host')
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const res = await fetch(`${protocol}://${host}/api/events/${id}`, { cache: 'no-store' })
    if (!res.ok) return null
    const data = await res.json()
    return data.event
}

export default async function EditEventPage({ params }) {
    const { id } = await params

    // require an authenticated organiser or admin
    const session = await getSession()
    if (!session || !['organiser', 'admin'].includes(session.role)) {
        redirect('/auth/login')
    }

    // load the event being edited
    const event = await loadEvent(id)
    if (!event) notFound()

    // organisers can only edit events they created
    if (session.role === 'organiser' && event.organiser_id !== session.userId) {
        redirect('/events')
    }

    return (
        <div className="pt-40 pb-32 px-8">
            <div className="max-w-2xl mx-auto">
                <SectionLabel index={1} jp="編集" en="Edit event" />

                <h1 className="font-serif text-5xl mb-12 leading-tight">
                    {event.title}
                </h1>

                {/* shared form in edit mode, prefilled with current data */}
                <EventForm mode="edit" initial={event} />
            </div>
        </div>
    )
}
