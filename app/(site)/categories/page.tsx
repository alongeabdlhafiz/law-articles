import Link from 'next/link'
import {client} from '@/sanity/lib/client'
export const revalidate = 60

type CategoryItem = {
  _id: string
  title: string
  slug: string
  description: string | null
  articleCount: number
}

const CATEGORIES_QUERY = `*[_type == "category"] | order(title asc) {
  _id,
  title,
  "slug": slug.current,
  description,
  "articleCount": count(*[_type == "article" && status == "published" && references(^._id)])
}`

export default async function CategoriesPage() {
  const categories = await client.fetch<CategoryItem[]>(CATEGORIES_QUERY)

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold">Categories</h1>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {categories.map((category) => (
          <li key={category._id}>
            <Link
              href={`/categories/${category.slug}`}
              className="block rounded-lg border border-navy/20 p-5 hover:border-gold"
            >
              <h2 className="text-lg font-semibold">{category.title}</h2>
              {category.description && (
                <p className="mt-1 text-sm opacity-70">{category.description}</p>
              )}
              <p className="mt-3 text-sm text-gold">
                {category.articleCount}{' '}
                {category.articleCount === 1 ? 'article' : 'articles'}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}