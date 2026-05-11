import EventsClient from './EventsClient'

// page metadata for the admin events page
export const metadata = {
    title: 'Admin · Events',
}

export default function Page() {
    return <EventsClient />
}