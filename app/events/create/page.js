import EventForm from '@/components/EventForm'
import SectionLabel from '@/components/SectionLabel'

// page metadata for the create page
export const metadata = {
    title: 'New event // NeuraCortex',
}

export default function CreateEventPage() {
    return (
        <div className="pt-40 pb-32 px-8">
            <div className="max-w-2xl mx-auto">
                <SectionLabel index={1} jp="新規" en="New event" />

                <h1 className="font-serif text-5xl mb-12 leading-tight">
                    Schedule a new programme
                </h1>

                {/* shared form in create mode */}
                <EventForm mode="create" />
            </div>
        </div>
    )
}
