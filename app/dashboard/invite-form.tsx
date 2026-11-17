"use client";

import { useActionState } from "react";
import { inviteUser, type InviteState } from "./actions";

export default function InviteForm() {
  const [state, formAction, pending] = useActionState<InviteState, FormData>(
    inviteUser,
    null
  );

  return (
    <form action={formAction} className="mt-8 space-y-3 rounded border p-4">
      <h2 className="text-lg font-semibold">Invite someone</h2>

      <input
        type="email"
        name="email"
        placeholder="Email address"
        required
        className="w-full rounded border px-3 py-2"
      />

      <select name="role" defaultValue="author" className="w-full rounded border px-3 py-2">
        <option value="author">Author</option>
        <option value="admin">Admin</option>
      </select>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-700">{state.success}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-slate-900 px-3 py-2 text-white disabled:opacity-60"
      >
        {pending ? "Sending..." : "Send invite"}
      </button>
    </form>
  );
}