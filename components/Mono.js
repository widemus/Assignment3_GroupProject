// inline monospace label used for technical annotations
export default function Mono({ children, className = '' }) {
    return (
        <span className={`font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute ${className}`}>
            {children}
        </span>
    )
}
