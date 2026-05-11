// small reusable label that prints a vertical-style number + japanese word + EN heading
export default function SectionLabel({ index, jp, en }) {
    return (
        <div className="flex items-baseline gap-6 mb-10">
            <span className="font-mono text-[11px] text-ink-mute tracking-[0.22em]">
                {String(index).padStart(2, '0')}
            </span>
            <span className="font-jp text-[11px] text-ink-mute tracking-[0.22em]">
                {jp}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em]">
                {en}
            </span>
        </div>
    )
}
