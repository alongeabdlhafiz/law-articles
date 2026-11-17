import Link from "next/link";
import MySubmissions from "./my-submissions";
import SubmitForm from "./submit-form";
import InviteForm from "./invite-form";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  async function signOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
      <p>Logged in as: {user.email}</p>
      <p>Role: {profile?.role ?? "unknown"}</p>

            <form action={signOut} className="mt-6">
        <button className="rounded bg-slate-900 px-3 py-2 text-white">
          Log out
        </button>
      </form>

       {profile?.role === "admin" && (
        <Link href="/dashboard/review" className="mt-6 inline-block underline">
          Review submissions
        </Link>
      )}
      <SubmitForm />
      <MySubmissions />
      {profile?.role === "admin" && <InviteForm />}
    </main>
  );
}