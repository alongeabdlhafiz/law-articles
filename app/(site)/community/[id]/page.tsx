import Link from "next/link";
import { notFound } from "next/navigation";
import { getFileUrl, getPublishedArticle } from "@/lib/published";

export const dynamic = "force-dynamic";

export default async function CommunityArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getPublishedArticle(id);
  if (!article) notFound();

  const fileUrl = await getFileUrl(article.file_path);
  const isPdf = /\.pdf$/i.test(article.file_name);

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <Link href="/community" className="text-sm underline">
        &larr; All community articles
      </Link>

      <h1 className="mb-1 mt-4 text-2xl font-bold">{article.title}</h1>
      <p className="mb-4 text-xs text-slate-500">
        By {article.authorName}
        {article.reviewed_at &&
          ` · ${new Date(article.reviewed_at).toLocaleDateString("en-GB")}`}
      </p>

      {article.summary && <p className="mb-6 text-sm">{article.summary}</p>}

      {!fileUrl ? (
        <p className="text-sm text-red-600">
          This article&apos;s file is currently unavailable.
        </p>
      ) : isPdf ? (
        <>
          <iframe
            src={fileUrl}
            title={article.title}
            className="h-[80vh] w-full rounded border"
          />
          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block text-sm underline"
          >
            Open or download the PDF
          </a>
        </>
      ) : (
        <a
          href={fileUrl}
          className="inline-block rounded bg-slate-900 px-4 py-2 text-white"
        >
          Download article ({article.file_name})
        </a>
      )}
    </main>
  );
}