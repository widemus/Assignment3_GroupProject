import SectionLabel from '@/components/SectionLabel'
import Mono from '@/components/Mono'

// page metadata for the research page
export const metadata = {
    title: 'Research // NeuraCortex',
    description: 'Current focus areas and published work.',
}

// list of focus areas shown as a numbered grid
const focusAreas = [
    {
        no: '01',
        jp: '基板',
        en: 'Substrate longevity',
        body: 'Extending culture lifespan past 365 days using continuous perfusion and selective antibiotic regimes.',
    },
    {
        no: '02',
        jp: '学習',
        en: 'Closed-loop learning',
        body: 'Training cortical cultures on simple goal-reaching tasks using stimulation-based reward shaping.',
    },
    {
        no: '03',
        jp: '計測',
        en: 'High-density readout',
        body: 'Mapping spike activity from 26K electrodes per array at sub-millisecond resolution.',
    },
    {
        no: '04',
        jp: '倫理',
        en: 'Ethics & oversight',
        body: 'Working with independent bioethics boards on consent, scope and termination criteria.',
    },
]

export default function ResearchPage() {
    return (
        <div className="pt-40 pb-32 px-8">
            <div className="max-w-[1400px] mx-auto">

                <SectionLabel index={1} jp="研究" en="Research" />

                {/* page title */}
                <h1 className="font-serif text-6xl leading-[1.02] tracking-tight max-w-3xl">
                    Four questions we are
                    <br />
                    actively working on.
                </h1>

                {/* focus area grid */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                    {focusAreas.map(area => (
                        <article key={area.no}>
                            <div className="flex items-baseline gap-4">
                                <Mono>{area.no}</Mono>
                                <span className="font-jp text-[11px] text-ink-mute tracking-[0.22em]">
                                    {area.jp}
                                </span>
                            </div>
                            <h3 className="font-serif text-3xl mt-3 leading-tight">{area.en}</h3>
                            <p className="font-serif text-lg text-ink-soft mt-3 leading-snug">
                                {area.body}
                            </p>
                        </article>
                    ))}
                </div>

                <div className="hairline my-20" />

                {/* publications strip (decorative) */}
                <SectionLabel index={2} jp="論文" en="Selected publications" />
                <ul className="font-serif text-xl text-ink-soft space-y-3">
                    <li>Cultured cortical tissue exhibits goal-shaped activity under closed-loop stimulation. <span className="font-mono text-[11px]">Nature Methods, 2025</span></li>
                    <li>Long-term stability of human-derived MEAs at 26K density. <span className="font-mono text-[11px]">Cell Reports, 2024</span></li>
                    <li>Bioethical framework for live-tissue compute. <span className="font-mono text-[11px]">Bioethics Quarterly, 2024</span></li>
                </ul>
            </div>
        </div>
    )
}
