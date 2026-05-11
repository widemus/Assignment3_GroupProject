import Link from 'next/link'
import SectionLabel from '@/components/SectionLabel'
import Mono from '@/components/Mono'

// homepage / sekiguchi-style landing
export default function Home() {
  return (
    <div className="bg-mint text-ink">

      {/* hero block */}
      <section className="relative min-h-screen overflow-hidden">
        {/* hero image bleeding from the right */}
        <img
          src="/hero-organism.jpg"
          alt="Translucent cortical organoid specimen"
          width={1280}
          height={1600}
          className="pointer-events-none absolute right-0 top-0 h-full w-[58%] object-cover opacity-90 mix-blend-multiply"
        />
        <div className="pointer-events-none absolute inset-0 scanlines opacity-30" />

        {/* vertical label on the left edge */}
        <div className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 hidden md:block">
          <div className="vertical-rl font-mono text-[10px] uppercase tracking-[0.4em] text-ink/60">
            CULTURE 7-A · TSUKUBA-03 · 視床皮質
          </div>
        </div>

        {/* tiny corner marks */}
        <span className="absolute right-8 top-32 font-mono text-[10px] uppercase tracking-[0.22em] text-ink/60">
          NEURASYNC™ V3.1 · CB
        </span>
        <span className="absolute bottom-20 right-8 font-mono text-[10px] uppercase tracking-[0.22em] text-ink/60">
          ⌖ 36.0835° N · 140.0764° E
        </span>

        {/* main hero copy */}
        <div className="relative mx-auto flex min-h-screen max-w-[1600px] flex-col justify-center px-8 md:px-12 pt-32 pb-32">
          <div className="max-w-[62%]">
            <Mono className="text-ink/70">— ORGANOID INTELLIGENCE / 神経培養</Mono>
            <h1 className="font-serif mt-10 text-[clamp(3rem,9vw,10rem)] font-light leading-[0.92] tracking-[-0.015em]">
              A dream,
              <br />
              <span className="italic">within</span> a dream.
            </h1>
            <p className="mt-12 max-w-md font-serif text-[15px] leading-relaxed text-ink/85">
              NeuraCortex grows living human cortical neurons on
              high-density microelectrode arrays and rents them as
              compute. Bio-hybrid intelligence — cultivated, wired
              and shipped from our <span className="font-mono">CULTURE 7-A</span>{' '}
              facility in Tsukuba.
            </p>
            {/* primary + ghost call-to-action */}
            <div className="mt-14 flex flex-wrap items-center gap-6">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-3 bg-ink px-7 py-4 font-mono text-[11px] uppercase tracking-[0.3em] text-mint hover:bg-accent transition-colors"
              >
                Get Access <span aria-hidden>→</span>
              </Link>
              <Link
                href="/research"
                className="font-serif text-xl italic text-ink/80 underline-offset-4 hover:text-accent hover:underline transition-colors"
              >
                read the whitepaper.
              </Link>
            </div>
          </div>
        </div>

        {/* long fat black strip at the bottom of the hero */}
        <div className="absolute inset-x-0 bottom-0 border-t border-ink/30 bg-ink text-mint">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-8 py-3 font-mono text-[10px] uppercase tracking-[0.25em]">
            <span className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 bg-mint blink" />
              LIVE · CULTURE 7-A · 812,403 NEURONS · 14.2 HZ
            </span>
            <span className="hidden md:inline opacity-70">
              心と引き離された身体 ／ Body separated from mind.
            </span>
            <span className="opacity-70">CHKSUM 0xA3F9 · BUILD 4.7.21</span>
          </div>
        </div>
      </section>

      {/* scrolling ticker */}
      <div className="overflow-hidden border-y border-ink/20 bg-mint">
        <div className="ticker-track flex whitespace-nowrap py-2 font-mono text-[11px] uppercase tracking-[0.25em] text-ink/80">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex shrink-0 items-center gap-10 px-10">
              <span>NEURASYNC™ V3.1 CB</span>
              <span>○</span>
              <span>CB-SERIES SUBSTRATE — IN STOCK</span>
              <span>○</span>
              <span>関口ジェネティクス · NEURACORTEX AG</span>
              <span>○</span>
              <span>"PLASTICITY UNDER DOPAMINERGIC REWARD" — NATURE 2026</span>
              <span>○</span>
              <span>ETHICS REVIEW BOARD CONVENES Q3</span>
              <span>○</span>
            </div>
          ))}
        </div>
      </div>

      {/* doctrine */}
      <section className="px-8 md:px-12 py-32">
        <div className="mx-auto grid max-w-[1600px] grid-cols-12 gap-8">
          {/* left numbered label */}
          <aside className="col-span-12 md:col-span-2">
            <div className="vertical-rl font-mono text-[10px] uppercase tracking-[0.4em] text-ink/60 hidden md:block">
              01 / DOCTRINE — 教義
            </div>
            <div className="md:hidden">
              <SectionLabel index={1} jp="教義" en="Doctrine" />
            </div>
          </aside>

          {/* large serif quote */}
          <div className="col-span-12 md:col-span-10">
            <p className="font-serif text-[clamp(1.8rem,4vw,4rem)] font-light leading-[1.05] tracking-tight">
              Silicon <span className="italic text-accent">plateaued.</span>{' '}
              Biology did not. We are not iterating on the transistor — we are{' '}
              <span className="italic">cultivating</span> the most efficient
              computer evolution has ever produced, and renting it by the hour.
            </p>

            {/* three-column promise grid */}
            <div className="mt-16 grid grid-cols-1 gap-12 border-t border-ink/15 pt-10 md:grid-cols-3">
              <div>
                <Mono className="text-ink/60">— § 01 PROVISION</Mono>
                <p className="mt-3 max-w-xs font-serif text-base leading-relaxed text-ink/80">
                  Cultivated cortical tissue, eighty thousand neurons per cm²,
                  speaking directly to a high-density microelectrode array.
                </p>
              </div>
              <div>
                <Mono className="text-ink/60">— § 02 COVENANT</Mono>
                <p className="mt-3 max-w-xs font-serif text-base leading-relaxed text-ink/80">
                  Sentience monitoring, third-party audit, and verifiable
                  shutdown built into every node we ship.
                </p>
              </div>
              <div>
                <Mono className="text-ink/60">— § 03 PROMISE</Mono>
                <p className="mt-3 max-w-xs font-serif text-base leading-relaxed text-ink/80">
                  One thousand times the energy efficiency of contemporary
                  silicon. The arithmetic is no longer in dispute.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* catalogue strip */}
      <section className="relative border-y border-ink/20 px-8 md:px-12 py-32 overflow-hidden">
        {/* specimen photograph as a full-bleed background */}
        <img
          src="/download.jpeg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-full w-[60%] object-cover opacity-90 mix-blend-multiply"
        />
        <div className="pointer-events-none absolute inset-0 scanlines opacity-20" />
        {/* faint measurement marks scattered over the background */}
        <span className="pointer-events-none absolute left-[42%] top-[18%] font-mono text-[11px] text-ink/55">12.4</span>
        <span className="pointer-events-none absolute left-[38%] top-[36%] font-mono text-[11px] text-ink/55">7.3</span>
        <span className="pointer-events-none absolute left-[48%] top-[58%] font-mono text-[11px] text-ink/55">31.6</span>
        <span className="pointer-events-none absolute right-[18%] bottom-[14%] font-mono text-[11px] text-ink/55">19.4</span>
        {/* vertical catalogue label on the far right */}
        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 hidden md:block">
          <div className="vertical-rl font-mono text-[10px] uppercase tracking-[0.4em] text-ink/65">
            02 / CATALOGUE — 製品案内
          </div>
        </div>
        <div className="relative mx-auto max-w-[1600px] grid grid-cols-12 gap-8">
          {/* big serif headline overlaid on the right */}
          <div className="col-span-12 md:col-span-7 md:col-start-6 md:text-right">
            <Mono className="text-ink/70">— FIG. 02 / NEURASYNC™ V3.1 CB</Mono>
            <h2 className="font-serif mt-8 text-[clamp(2.6rem,7vw,7rem)] font-light leading-[0.9] tracking-[-0.015em]">
              Grown,
              <br />
              <span className="italic">not</span> built.
            </h2>
          </div>

          {/* spec table on the left */}
          <div className="col-span-12 md:col-span-5 md:col-start-1 md:row-start-1 md:self-end">
            <div className="max-w-sm space-y-6">
              <p className="font-mono text-[12px] leading-relaxed text-ink/85">
                Each NEURASYNC™ V3.1 CB module is a living lattice of
                cultivated human cortical neurons, perfused on a
                26,000-channel microelectrode array. Cultivated, calibrated
                and shipped in sealed culture vessels from Tsukuba.
              </p>
              <div className="border-t border-ink/30 pt-5">
                <div className="grid grid-cols-2 gap-y-3 font-mono text-[11px] uppercase tracking-wider text-ink/80">
                  <span className="text-ink/50">Substrate</span>
                  <span className="text-right">CULTURE 7-A · CB</span>
                  <span className="text-ink/50">Density</span>
                  <span className="text-right">≈ 80,000 / cm²</span>
                  <span className="text-ink/50">Viability</span>
                  <span className="text-right">214 d · 99.7%</span>
                  <span className="text-ink/50">Energy / op.</span>
                  <span className="text-right text-accent">≈ 0.1 pJ</span>
                </div>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/55">
                培養槽 07A ／ Catalogue ref. NX-V3.1-CB · lease only.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* call-to-events */}
      <section className="px-8 md:px-12 py-24">
        <div className="mx-auto max-w-[1600px] flex flex-col md:flex-row items-end justify-between gap-8">
          <div>
            <SectionLabel index={3} jp="案内" en="Public Programme" />
            <h2 className="font-serif text-4xl md:text-5xl leading-tight max-w-2xl">
              Webinars and lab excursions, open
              <br /> to researchers and the curious.
            </h2>
          </div>

          <Link
            href="/events"
            className="font-mono text-[11px] uppercase tracking-[0.22em] border-b border-ink pb-1 hover:text-accent hover:border-accent transition-colors"
          >
            Browse the calendar →
          </Link>
        </div>
      </section>
    </div>
  )
}
