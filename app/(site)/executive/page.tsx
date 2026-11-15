import type {Metadata} from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Meet Your Executive',
  description:
    'Meet the Head of Chambers of Femi Falana Chambers, Faculty of Law, Olabisi Onabanjo University.',
}

export default function ExecutivePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12">
      <h1 className="text-2xl font-bold sm:text-3xl">Meet Your Executives</h1>

      <div className="mt-8 grid gap-8 md:grid-cols-[18rem_1fr] md:items-start">
        <div className="mx-auto w-full max-w-xs md:mx-0">
          <Image
            src="/head-of-chambers.webp"
            alt="Mufutau Rahmon Oluwaseun, Head of Chambers"
            width={480}
            height={600}
            priority
            className="h-auto w-full rounded-lg border-4 border-gold object-cover"
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold">Mufutau Rahmon Oluwaseun</h2>
          <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-gold">
            Head of Chambers
          </p>
          <p className="mt-5 leading-relaxed">
            Mufutau Rahmon Oluwaseun is a 500-level student of the Faculty of
            Law, Olabisi Onabanjo University.
          </p>
          <p className="mt-4 leading-relaxed">
            In recognition of his outstanding academic performance and
            acknowledged excellence, he currently serves as the Head of Chambers
            of Femi Falana Chambers.
          </p>
        </div>
      </div>
    </main>
  )
}