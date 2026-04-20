import { redirect } from "next/navigation";

import { signInAdminAction } from "@/lib/actions/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const { error, next } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/admin");
  }

  return (
    <div className="mx-auto max-w-md py-12">
      <div className="rounded-[32px] border border-brand-100 bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">
          Protected access
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-ink">Admin Login</h1>
        <p className="mt-3 text-sm text-slate-600">
          Sign in with the clinic's admin account to manage appointments and doctors.
        </p>

        <form action={signInAdminAction} className="mt-8 space-y-4">
          <input
            type="hidden"
            name="next"
            value={
              next && next.startsWith("/") && !next.startsWith("//")
                ? next
                : "/admin"
            }
          />
          <label className="block space-y-2">
            <span className="text-sm font-medium text-ink">Email</span>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-2xl border border-brand-100 px-4 py-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-ink">Password</span>
            <input
              type="password"
              name="password"
              required
              className="w-full rounded-2xl border border-brand-100 px-4 py-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            />
          </label>
          {error ? (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            className="w-full rounded-2xl bg-brand-700 px-5 py-3 font-semibold text-white"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
