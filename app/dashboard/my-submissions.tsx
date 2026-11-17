import { createClient } from "@/lib/supabase/server";

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default async function MySubmissions() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: submissions } = await supabase
    .from("submissions")
    .select("id, title, status, admin_note, created_at")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <section className="mt-8">
      <h2 className="mb-3 text-lg font-semibold">My submissions</h2>

      {!submissions || submissions.length === 0 ? (
        <p className="text-sm text-slate-600">
          You haven&apos;t submitted anything yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {submissions.map((s) => (
            <li key={s.id} className="rounded border p-3">
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium">{s.title}</p>
                <span
                  className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium capitalize ${
                    statusStyles[s.status] ?? ""
                  }`}
                >
                  {s.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Submitted {new Date(s.created_at).toLocaleDateString("en-GB")}
              </p>
              {s.admin_note && (
                <p className="mt-2 text-sm text-slate-700">
                  Admin note: {s.admin_note}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}