"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type InviteState = { error?: string; success?: string } | null;

export async function inviteUser(
  prevState: InviteState,
  formData: FormData
): Promise<InviteState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const role = formData.get("role") === "admin" ? "admin" : "author";

  if (!email) return { error: "Enter an email address." };

  // Only a logged-in admin may invite
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You are not logged in." };

  const { data: me } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (me?.role !== "admin") return { error: "Only admins can invite people." };

  const admin = createAdminClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${siteUrl}/set-password`,
  });
  if (error) return { error: error.message };

  // New profiles default to author, so only change it for admin invites
  if (role === "admin" && data.user) {
    const { error: roleError } = await admin
      .from("profiles")
      .update({ role })
      .eq("id", data.user.id);
    if (roleError) return { error: roleError.message };
  }

  return { success: `Invitation sent to ${email} as ${role}.` };
}