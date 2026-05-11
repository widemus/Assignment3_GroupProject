"use client"

import { useRouter, useSearchParams } from 'next/navigation'

// filter bar shown above the events list
export default function EventFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    // current filter values from the url
    const currentType = searchParams.get('type') || ''
    const currentAvail = searchParams.get('available') === 'true'

    // function to update a single filter value in the url
    const setParam = (key, value) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value) {
            params.set(key, value)
        } else {
            params.delete(key) // remove the key if value is empty/false
        }
        router.push(`/events?${params.toString()}`)
    }

    // helper styling for filter buttons
    const btn = (active) =>
        `font-mono text-[11px] uppercase tracking-[0.22em] px-3 py-2 border ${active ? 'bg-ink text-mint border-ink' : 'border-ink/30 hover:border-ink'
        }`

    return (
        <div className="flex flex-wrap items-center gap-3 mb-12">
            <span className="font-mono text-[10px] text-ink-mute uppercase tracking-[0.22em] mr-2">
                Filter
            </span>

            {/* type filters */}
            <button onClick={() => setParam('type', '')} className={btn(currentType === '')}>All</button>
            <button onClick={() => setParam('type', 'webinar')} className={btn(currentType === 'webinar')}>Webinar</button>
            <button onClick={() => setParam('type', 'excursion')} className={btn(currentType === 'excursion')}>Excursion</button>

            {/* availability toggle */}
            <button
                onClick={() => setParam('available', currentAvail ? '' : 'true')}
                className={btn(currentAvail)}
            >
                Available only
            </button>
        </div>
    )
}
