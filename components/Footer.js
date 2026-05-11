import Link from 'next/link'

export default function Footer() {
    // year shown in the copyright line
    const year = new Date().getFullYear()

    return (
        <footer className="border-t border-ink/15 mt-32">
            <div className="max-w-[1400px] mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">

                {/* brand block */}
                <div>
                    <p className="font-serif text-2xl">NeuraCortex</p>
                    <p className="font-mono text-[10px] text-ink-mute mt-2 tracking-[0.22em] uppercase">
                        Cultivated cortical compute / CB-001
                    </p>
                </div>

                {/* navigation block */}
                <div>
                    <p className="font-mono text-[10px] text-ink-mute uppercase tracking-[0.22em] mb-4">Site</p>
                    <ul className="space-y-2 font-serif">
                        <li><Link href="/about">About</Link></li>
                        <li><Link href="/research">Research</Link></li>
                        <li><Link href="/events">Events</Link></li>
                    </ul>
                </div>

                {/* facilities block (decorative) */}
                <div>
                    <p className="font-mono text-[10px] text-ink-mute uppercase tracking-[0.22em] mb-4">Nodes</p>
                    <ul className="space-y-2 font-serif">
                        <li>Tsukuba / HQ <span className="font-mono text-[10px] text-ink-mute">つくば</span></li>
                        <li>Singapore</li>
                        <li>Tokyo <span className="font-mono text-[10px] text-ink-mute">東京</span></li>
                    </ul>
                </div>

                {/* contact block (decorative) */}
                <div>
                    <p className="font-mono text-[10px] text-ink-mute uppercase tracking-[0.22em] mb-4">Contact</p>
                    <ul className="space-y-2 font-serif">
                        <li>hello@neuracortex.com</li>
                        <li>+81 12 345 6789</li>
                    </ul>
                </div>
            </div>

            {/* black bottom strip echoing the hero */}
            <div className="bg-ink text-mint">
                <div className="max-w-[1600px] mx-auto px-8 py-4 flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.25em]">
                    <span>© {year} NeuraCortex Ltd · 関口 · NX-2049</span>
                    <span className="hidden md:inline opacity-70">CULTURE 7-A · TSUKUBA-03</span>
                    <span className="opacity-70">CHKSUM 0xA3F9 · BUILD 4.7.21</span>
                </div>
            </div>
        </footer>
    )
}
