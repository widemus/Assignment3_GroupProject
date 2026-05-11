import { redirect } from 'next/navigation'
import Link from 'next/link'
import SectionLabel from '@/components/SectionLabel'
import Mono from '@/components/Mono'
import { getSession } from '@/lib/auth'

// page metadata for the admin dashboard
export const metadata = {
    title: 'Admin // NeuraCortex',
}

export default async function AdminPage() {
    // restrict this page to admins only
    const session = await getSession()
    if (!session || session.role !== 'admin') redirect('/')

    return (
        <div className="pt-40 pb-32 px-8">
            <div className="max-w-[1100px] mx-auto">

                <SectionLabel index={0} jp="管理" en="Admin" />

                <h1 className="font-serif text-6xl leading-[1.02] tracking-tight mb-12">
                    Control room
                </h1>

                <p className="font-serif text-xl text-ink-soft mb-12 max-w-2xl">
                    Signed in as <span className="text-ink">{session.username}</span>.
                    From here you can manage every account and every event.
                </p>

                {/* admin tiles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <Link
                        href="/admin/users"
                        className="block border border-ink/15 p-8 hover:border-ink hover:bg-mint-soft transition-colors"
                    >
                        <Mono>01 / Accounts</Mono>
                        <h2 className="font-serif text-3xl mt-3 leading-tight">Manage users</h2>
                        <p className="font-serif text-ink-soft mt-3">
                            View, create and remove user accounts. Promote
                            attendees to organisers or admins.
                        </p>
                    </Link>

                    <Link
                        href="/admin/events"
                        className="block border border-ink/15 p-8 hover:border-ink hover:bg-mint-soft transition-colors"
                    >
                        <Mono>02 / Programme</Mono>
                        <h2 className="font-serif text-3xl mt-3 leading-tight">Manage events</h2>
                        <p className="font-serif text-ink-soft mt-3">
                            Edit or delete any webinar or excursion across the
                            entire calendar.
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    )
}
