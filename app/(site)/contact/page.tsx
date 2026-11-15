export default function ContactPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-12">
      <h1 className="text-2xl font-bold sm:text-3xl">Contact Us</h1>
      <p className="mt-4 leading-relaxed">
        Have a question, a correction, or an article you would like to write for
        us? Get in touch.
      </p>

      <dl className="mt-8 space-y-6">
        <div>
          <dt className="text-sm font-semibold uppercase tracking-wide text-gold">
            Email
          </dt>
          <dd className="mt-1 break-all">
            <a
              href="mailto:mufutaurahmon913@gmail.com"
              className="hover:underline"
            >
              mufutaurahmon913@gmail.com
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-sm font-semibold uppercase tracking-wide text-gold">
            Phone
          </dt>
          <dd className="mt-1">
            <a href="tel:+2347035373640" className="hover:underline">
                            +234 703 537 3640
            </a>
          </dd>
        </div>
      </dl>
    </main>
  )
}