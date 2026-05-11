// colored tag for booking status (confirmed / cancelled / waitlisted)
export default function StatusTag({ status }) {
    // pick colors based on status value
    const colorMap = {
        confirmed: 'bg-ink text-mint',
        cancelled: 'bg-mint-deep text-ink-mute line-through',
        waitlisted: 'bg-accent text-mint',
    }

    const cls = colorMap[status] || 'bg-mint-deep text-ink'

    return (
        <span className={`font-mono text-[10px] uppercase tracking-[0.22em] px-2 py-1 ${cls}`}>
            {status}
        </span>
    )
}
