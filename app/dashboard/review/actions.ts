"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function reviewSubmission(formData: FormData) {
  const id = String(formData.get("id") || "");
  const decision = formData.get("decision");
  const note = String(formData.get("note") || "").trim();

  if (!id || (decision !== "approved" && decision !== "rejected")) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: me } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (me?.role !== "admin") return;

  await supabase
    .from("submissions")
    .update({
      status: decision,
      admin_note: note || null,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath("/dashboard/review");
  revalidatePath("/dashboard");
}