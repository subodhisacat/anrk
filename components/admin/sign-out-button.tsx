"use client";

import { useFormStatus } from "react-dom";

import { signOutAdminAction } from "@/lib/actions/admin";

function SignOutSubmit() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="rounded-full border border-brand-200 px-4 py-2 text-sm font-medium text-brand-700"
    >
      {pending ? "Signing out..." : "Sign Out"}
    </button>
  );
}

export function SignOutButton() {
  return (
    <form action={signOutAdminAction}>
      <SignOutSubmit />
    </form>
  );
}
