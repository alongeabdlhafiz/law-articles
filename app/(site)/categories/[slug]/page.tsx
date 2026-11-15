import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
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

type CategoryPage = {
  title: string
  description: string | null
  articles: ArticleCard[]
}

const CATEGORY_QUERY = `*[_type == "category" && slug.current == $slug][0] {
  title,
  description,
  "articles": *[_type == "article" && status == "published" && references(^._id)] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    subtitle,
    publishedAt,
    "authorName": author->name,
    coverImage
  }
}`

export default async function CategoryPage({
  params,
}: {
  params: Promise<{slug: string}>
}) {
  const {slug} = await params
  const category = await client.fetch<CategoryPage | null>(CATEGORY_QUERY, {slug})

  if (!category) notFound()

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-wide text-gold">Category</p>
      <h1 className="text-3xl font-bold">{category.title}</h1>
      {category.description && (
        <p className="mt-2 opacity-70">{category.description}</p>
      )}

      {category.articles.length === 0 ? (
        <p className="mt-10 opacity-60">No published articles in this category yet.</p>
      ) : (
        <ul className="mt-10 space-y-10">
          {category.articles.map((article) => (
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
      )}
    </main>
  )
}