import Link from "next/link";
import { getPublishedArticles } from "@/lib/published";

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const articles = await getPublishedArticles();

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold">Community Articles</h1>

      {articles.length === 0 ? (
        <p className="text-sm text-slate-600">No articles published yet.</p>
      ) : (
        <ul className="space-y-6">
          {articles.map((a) => (
            <li key={a.id} className="border-b pb-6">
              <Link href={`/community/${a.id}`}>
                <h2 className="text-lg font-semibold underline">{a.title}</h2>
              </Link>
              <p className="mt-1 text-xs text-slate-500">
                By {a.authorName}
                {a.reviewed_at &&
                  ` · ${new Date(a.reviewed_at).toLocaleDateString("en-GB")}`}
              </p>
              {a.summary && <p className="mt-2 text-sm">{a.summary}</p>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}