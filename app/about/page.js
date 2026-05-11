import SectionLabel from '@/components/SectionLabel'
import Mono from '@/components/Mono'

// page metadata for the about page
export const metadata = {
    title: 'About // NeuraCortex',
    description: 'Why we are growing cortical tissue on silicon.',
}

export default function AboutPage() {
    return (
        <div className="pt-40 pb-32 px-8">
            <div className="max-w-[1100px] mx-auto">

                <SectionLabel index={1} jp="紹介" en="About" />

                {/* opening statement */}
                <h1 className="font-serif text-6xl leading-[1.02] tracking-tight">
                    A small lab in Tsukuba,
                    <br />
                    growing thought.
                </h1>

                {/* poetic body */}
                <div className="mt-16 grid grid-cols-12 gap-12">

                    <div className="col-span-12 md:col-span-3">
                        <Mono>Origin</Mono>
                    </div>

                    <div className="col-span-12 md:col-span-9 space-y-6 font-serif text-xl text-ink-soft leading-snug">
                        <p>
                            NeuraCortex began in 2021 as a question — could we
                            keep a piece of cortex alive long enough, and
                            connected enough, to ask it something?
                        </p>
                        <p>
                            Three years and forty failed cultures later, the
                            answer is yes. Our CB-001 substrate has been
                            online for one hundred and eighty-seven days,
                            learning the shape of incoming stimuli the way
                            a rainforest learns the shape of weather.
                        </p>
                        <p>
                            We are not building consciousness, and we are not
                            transferring memories. We are growing a kind of
                            calculator that happens to be alive.
                        </p>
                    </div>
                </div>

                <div className="hairline my-20" />

                {/* team / contact strip */}
                <div className="grid grid-cols-12 gap-12">
                    <div className="col-span-12 md:col-span-3">
                        <Mono>People</Mono>
                    </div>
                    <div className="col-span-12 md:col-span-9 font-serif text-xl text-ink-soft leading-snug">
                        Eighteen researchers across Tsukuba, Singapore and
                        Tokyo. We hire neuroscientists, microfluidic engineers,
                        and one very patient ethicist.
                    </div>
                </div>
            </div>
        </div>
    )
}
