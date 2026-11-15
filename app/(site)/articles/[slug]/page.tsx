import type {ComponentProps} from 'react'
import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {PortableText, type PortableTextComponents} from '@portabletext/react'
import type {SanityImageSource} from '@sanity/image-url'
import {client} from '@/sanity/lib/client'
import {urlFor} from '@/sanity/lib/image'

type Article = {
  title: string
  subtitle: string
  publishedAt: string | null
  authorName: string | null
  authorSlug: string | null
  coverImage: (SanityImageSource & {alt?: string}) | null
  body: ComponentProps<typeof PortableText>['value'] | null
}

type ArticleMeta = {
  title: string
  subtitle: string
  seoTitle: string | null
  seoDescription: string | null
  publishedAt: string | null
  authorName: string | null
  coverImage: SanityImageSource | null
}

const ARTICLE_QUERY = `*[_type == "article" && slug.current == $slug && status == "published"][0] {
  title,
  subtitle,
  publishedAt,
  "authorName": author->name,
  "authorSlug": author->slug.current,
  coverImage,
  body
}`

const META_QUERY = `*[_type == "article" && slug.current == $slug && status == "published"][0] {
  title,
  subtitle,
  seoTitle,
  seoDescription,
  publishedAt,
  "authorName": author->name,
  coverImage
}`

export async function generateMetadata({
  params,
}: {
  params: Promise<{slug: string}>
}): Promise<Metadata> {
  const {slug} = await params
  const article = await client.fetch<ArticleMeta | null>(META_QUERY, {slug})

  if (!article) return {title: 'Article not found'}

  const title = article.seoTitle || article.title
  const description = article.seoDescription || article.subtitle
  const image = article.coverImage
    ? urlFor(article.coverImage).width(1200).height(630).url()
    : undefined

  return {
    title,
    description,
    alternates: {canonical: `/articles/${slug}`},
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: article.publishedAt ?? undefined,
      authors: article.authorName ? [article.authorName] : undefined,
      images: image ? [{url: image, width: 1200, height: 630}] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
}

const components: PortableTextComponents = {
  block: {
    normal: ({children}) => <p className="my-4 leading-relaxed">{children}</p>,
    h2: ({children}) => <h2 className="mb-3 mt-8 text-2xl font-bold">{children}</h2>,
    h3: ({children}) => <h3 className="mb-2 mt-6 text-xl font-semibold">{children}</h3>,
    blockquote: ({children}) => (
      <blockquote className="my-6 border-l-4 pl-4 italic opacity-80">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({children}) => <ul className="my-4 list-disc pl-6">{children}</ul>,
    number: ({children}) => <ol className="my-4 list-decimal pl-6">{children}</ol>,
  },
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{slug: string}>
}) {
  const {slug} = await params
  const article = await client.fetch<Article | null>(ARTICLE_QUERY, {slug})

  if (!article) notFound()

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-4xl font-bold">{article.title}</h1>
      <p className="mt-3 text-lg opacity-70">{article.subtitle}</p>
      <p className="mt-2 text-sm opacity-50">
        {article.authorSlug ? (
          <Link href={`/authors/${article.authorSlug}`} className="hover:text-gold hover:underline">
            {article.authorName}
          </Link>
        ) : (
          article.authorName
        )}
        {article.publishedAt
          ? ` · ${new Date(article.publishedAt).toLocaleDateString()}`
          : ''}
      </p>
      {article.coverImage && (
        <Image
          src={urlFor(article.coverImage).width(1200).height(675).url()}
          alt={article.coverImage.alt ?? article.title}
          width={1200}
          height={675}
          priority
          className="mt-8 aspect-video w-full rounded-lg object-cover"
        />
      )}
      <div className="mt-8">
        <PortableText value={article.body ?? []} components={components} />
      </div>
    </main>
  )
}