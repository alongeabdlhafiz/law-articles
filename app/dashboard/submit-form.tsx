"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export default function SubmitForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setError("");
    setSuccess("");

    if (!file) {
      setError("Please choose a file.");
      return;
    }
    if (!/\.(pdf|doc|docx)$/i.test(file.name)) {
      setError("Only PDF or Word files (.pdf, .doc, .docx) are allowed.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("File is too large. The limit is 10 MB.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("You are not logged in.");
      setLoading(false);
      return;
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `${user.id}/${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("submissions")
      .upload(filePath, file);

    if (uploadError) {
      setError(uploadError.message);
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("submissions").insert({
      author_id: user.id,
      title,
      summary,
      file_path: filePath,
      file_name: file.name,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    setSuccess("Submitted! An admin will review your article.");
    setTitle("");
    setSummary("");
    setFile(null);
    form.reset();
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-3 rounded border p-4">
      <h2 className="text-lg font-semibold">Submit an article</h2>

      <input
        type="text"
        placeholder="Article title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full rounded border px-3 py-2"
      />

      <textarea
        placeholder="Short summary (2-3 sentences)"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        rows={3}
        className="w-full rounded border px-3 py-2"
      />

      <div>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          required
          className="w-full text-sm"
        />
        <p className="mt-1 text-xs text-slate-500">
          PDF or Word file, up to 10 MB.
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-700">{success}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-slate-900 px-3 py-2 text-white disabled:opacity-60"
      >
        {loading ? "Uploading..." : "Submit for review"}
      </button>
    </form>
  );
}