import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import type {SanityImageSource} from '@sanity/image-url'
import {client} from '@/sanity/lib/client'
import {urlFor} from '@/sanity/lib/image'

type AuthorArticle = {
  _id: string
  title: string
  slug: string
  subtitle: string
  publishedAt: string | null
}

type AuthorProfile = {
  name: string
  image: SanityImageSource | null
  institution: string | null
  interests: string[] | null
  bio: string | null
  articles: AuthorArticle[]
}

const AUTHOR_QUERY = `*[_type == "author" && slug.current == $slug][0] {
  name,
  image,
  institution,
  interests,
  bio,
  "articles": *[_type == "article" && status == "published" && author._ref == ^._id] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    subtitle,
    publishedAt
  }
}`

export default async function AuthorPage({
  params,
}: {
  params: Promise<{slug: string}>
}) {
  const {slug} = await params
  const author = await client.fetch<AuthorProfile | null>(AUTHOR_QUERY, {slug})

  if (!author) notFound()

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-center gap-5">
        {author.image && (
          <Image
            src={urlFor(author.image).width(160).height(160).url()}
            alt={author.name}
            width={80}
            height={80}
            className="h-20 w-20 rounded-full object-cover"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold">{author.name}</h1>
          {author.institution && (
            <p className="opacity-70">{author.institution}</p>
          )}
        </div>
      </div>

      {author.bio && <p className="mt-6 leading-relaxed">{author.bio}</p>}

      {author.interests && author.interests.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {author.interests.map((interest) => (
            <span
              key={interest}
              className="rounded-full border border-gold px-3 py-1 text-sm"
            >
              {interest}
            </span>
          ))}
        </div>
      )}

      <h2 className="mt-12 text-2xl font-bold">Published articles</h2>
      {author.articles.length === 0 ? (
        <p className="mt-4 opacity-60">No published articles yet.</p>
      ) : (
        <ul className="mt-6 space-y-6">
          {author.articles.map((article) => (
            <li key={article._id}>
              <h3 className="text-lg font-semibold">
                <Link href={`/articles/${article.slug}`} className="hover:underline">
                  {article.title}
                </Link>
              </h3>
              <p className="opacity-70">{article.subtitle}</p>
              {article.publishedAt && (
                <p className="text-sm opacity-50">
                  {new Date(article.publishedAt).toLocaleDateString()}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}