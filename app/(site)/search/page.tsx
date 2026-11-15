import Image from 'next/image'
import Link from 'next/link'
import type {SanityImageSource} from '@sanity/image-url'
import {client} from '@/sanity/lib/client'
import {urlFor} from '@/sanity/lib/image'


type ArticleCard = {
  _id: string
  title: string
  slug: string
  subtitle: string
  publishedAt: string | null
  authorName: string | null
  coverImage: (SanityImageSource & {alt?: string}) | null
}

const SEARCH_QUERY = `*[_type == "article" && status == "published" && (
  title match $pattern || subtitle match $pattern || tags[] match $pattern
)] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  subtitle,
  publishedAt,
  "authorName": author->name,
  coverImage
}`

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{q?: string}>
}) {
  const {q} = await searchParams
  const term = (q ?? '').trim().slice(0, 80)

  const articles = term
    ? await client.fetch<ArticleCard[]>(SEARCH_QUERY, {pattern: `${term}*`})
    : []

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold">Search</h1>

      <form action="/search" method="get" className="mt-6 flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={term}
          placeholder="Search articles..."
          className="w-full rounded-lg border border-navy/30 px-4 py-2"
        />
        <button
          type="submit"
          className="rounded-lg bg-navy px-5 py-2 font-semibold text-white hover:bg-navy/90"
        >
          Search
        </button>
      </form>

      {!term ? (
        <p className="mt-10 opacity-60">Type something above to find articles.</p>
      ) : articles.length === 0 ? (
        <p className="mt-10 opacity-60">No articles found for “{term}”.</p>
      ) : (
        <>
          <p className="mt-8 text-sm opacity-60">
            {articles.length} {articles.length === 1 ? 'result' : 'results'} for “{term}”
          </p>
          <ul className="mt-6 space-y-10">
            {articles.map((article) => (
              <li key={article._id}>
                {article.coverImage && (
                  <Link href={`/articles/${article.slug}`}>
                    <Image
                      src={urlFor(article.coverImage).width(800).height(450).url()}
                      alt={article.coverImage.alt ?? article.title}
                      width={800}
                      height={450}
                      className="mb-4 aspect-video w-full rounded-lg object-cover"
                    />
                  </Link>
                )}
                <h2 className="text-xl font-semibold">
                  <Link href={`/articles/${article.slug}`} className="hover:underline">
                    {article.title}
                  </Link>
                </h2>
                <p className="opacity-70">{article.subtitle}</p>
                <p className="text-sm opacity-50">
                  {article.authorName}
                  {article.publishedAt
                    ? ` · ${new Date(article.publishedAt).toLocaleDateString()}`
                    : ''}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  )
}