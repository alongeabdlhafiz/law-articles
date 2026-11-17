import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { reviewSubmission } from "./actions";

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default async function ReviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: me } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (me?.role !== "admin") redirect("/dashboard");

  const { data: rows } = await supabase
    .from("submissions")
    .select(
      "id, title, summary, file_path, file_name, status, admin_note, created_at, profiles(full_name)"
    )
    .order("created_at", { ascending: false });

  // Pending first, then the rest
  const submissions = [...(rows ?? [])].sort(
    (a, b) => Number(b.status === "pending") - Number(a.status === "pending")
  );

  const withLinks = await Promise.all(
    submissions.map(async (s) => {
      const { data } = await supabase.storage
        .from("submissions")
        .createSignedUrl(s.file_path, 60 * 60);
      const profile = Array.isArray(s.profiles) ? s.profiles[0] : s.profiles;
      return {
        ...s,
        authorName: profile?.full_name || "Unnamed author",
        downloadUrl: data?.signedUrl ?? null,
      };
    })
  );

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/dashboard" className="text-sm underline">
        &larr; Back to dashboard
      </Link>
      <h1 className="mb-6 mt-3 text-2xl font-bold">Review submissions</h1>

      {withLinks.length === 0 ? (
        <p className="text-sm text-slate-600">No submissions yet.</p>
      ) : (
        <ul className="space-y-4">
          {withLinks.map((s) => (
            <li key={s.id} className="rounded border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{s.title}</p>
                  <p className="text-xs text-slate-500">
                    By {s.authorName} on{" "}
                    {new Date(s.created_at).toLocaleDateString("en-GB")}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium capitalize ${
                    statusStyles[s.status] ?? ""
                  }`}
                >
                  {s.status}
                </span>
              </div>

              {s.summary && <p className="mt-2 text-sm">{s.summary}</p>}

              {s.downloadUrl ? (
                <a
                  href={s.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-sm underline"
                >
                  Download: {s.file_name}
                </a>
              ) : (
                <p className="mt-2 text-sm text-red-600">File link unavailable.</p>
              )}

              <form action={reviewSubmission} className="mt-3 space-y-2">
                <input type="hidden" name="id" value={s.id} />
                <textarea
                  name="note"
                  defaultValue={s.admin_note ?? ""}
                  placeholder="Note to the author (optional)"
                  rows={2}
                  className="w-full rounded border px-3 py-2 text-sm"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    name="decision"
                    value="approved"
                    className="rounded bg-green-700 px-3 py-1.5 text-sm text-white"
                  >
                    Approve
                  </button>
                  <button
                    type="submit"
                    name="decision"
                    value="rejected"
                    className="rounded bg-red-700 px-3 py-1.5 text-sm text-white"
                  >
                    Reject
                  </button>
                </div>
              </form>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}