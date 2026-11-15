export default function AboutPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-bold">About LawJournal</h1>
      <p className="mt-4 leading-relaxed">
        LawJournal is an online publication where law students and legal writers
        share articles, opinions and educational content. Our goal is to make
        legal knowledge clear, accessible and credible.
      </p>

      <h2 className="mt-10 text-2xl font-bold">Become a contributor</h2>
      <p className="mt-3 leading-relaxed">
        Are you a law student with something to say? Contributors write on topics
        such as constitutional law, criminal law, commercial law, human rights,
        international law and legal technology.
      </p>
      <ol className="mt-4 list-decimal space-y-2 pl-6">
        <li>Get in touch with us and tell us what you would like to write about.</li>
        <li>Receive an author account and write your article in our editor.</li>
        <li>Submit it for review. Our editors may send feedback.</li>
        <li>Once approved, your article is published under your name.</li>
      </ol>
    </main>
  )
}