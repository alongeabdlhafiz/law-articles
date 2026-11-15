import Image from 'next/image'
import Link from 'next/link'
import type {SanityImageSource} from '@sanity/image-url'
import {client} from '@/sanity/lib/client'
import {urlFor} from '@/sanity/lib/image'
export const revalidate = 60

type ArticleCard = {
  _id: string
  title: string
  slug: string
  subtitle: string
  publishedAt: string | null
  authorName: string | null
  coverImage: (SanityImageSource & {alt?: string}) | null
}

const ARTICLES_QUERY = `*[_type == "article" && status == "published"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  subtitle,
  publishedAt,
  "authorName": author->name,
  coverImage
}`

export default async function Home() {
  const articles = await client.fetch<ArticleCard[]>(ARTICLES_QUERY)

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold">Latest Articles</h1>
      <ul className="mt-8 space-y-10">
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
    </main>
  )
}