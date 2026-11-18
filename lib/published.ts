import { createAdminClient } from "@/lib/supabase/admin";

export type PublishedArticle = {
  id: string;
  title: string;
  summary: string | null;
  file_name: string;
  file_path: string;
  reviewed_at: string | null;
  authorName: string;
};

function toArticle(row: any): PublishedArticle {
  const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    file_name: row.file_name,
    file_path: row.file_path,
    reviewed_at: row.reviewed_at,
    authorName: profile?.full_name || "Contributor",
  };
}

const COLUMNS =
  "id, title, summary, file_name, file_path, reviewed_at, profiles(full_name)";

export async function getPublishedArticles(): Promise<PublishedArticle[]> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("submissions")
    .select(COLUMNS)
    .eq("status", "approved")
    .order("reviewed_at", { ascending: false });
  return (data ?? []).map(toArticle);
}

export async function getPublishedArticle(
  id: string
): Promise<PublishedArticle | null> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("submissions")
    .select(COLUMNS)
    .eq("id", id)
    .eq("status", "approved")
    .maybeSingle();
  return data ? toArticle(data) : null;
}

export async function getFileUrl(filePath: string): Promise<string | null> {
  const admin = createAdminClient();
  const { data } = await admin.storage
    .from("submissions")
    .createSignedUrl(filePath, 60 * 60);
  return data?.signedUrl ?? null;
}