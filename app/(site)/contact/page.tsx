export default function ContactPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-bold">Contact Us</h1>
      <p className="mt-4 leading-relaxed">
        Have a question, a correction, or an article you would like to write for
        us? Get in touch.
      </p>

      <dl className="mt-8 space-y-6">
        <div>
          <dt className="text-sm font-semibold uppercase tracking-wide text-gold">
            Email
          </dt>
          <dd className="mt-1">
            <a
              href="mailto:alongeabdlhafiz@gmail.com"
              className="hover:underline"
            >
              alongeabdlhafiz@gmail.com
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-sm font-semibold uppercase tracking-wide text-gold">
            Phone
          </dt>
          <dd className="mt-1">
            <a href="tel:+2347035253587" className="hover:underline">
              07035253587
            </a>
          </dd>
        </div>
      </dl>
    </main>
  )
}