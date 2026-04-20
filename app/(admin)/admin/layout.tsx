import Link from "next/link";

import { SignOutButton } from "@/components/admin/sign-out-button";
import { requireAdminUser } from "@/lib/auth";

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  await requireAdminUser();

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-4 rounded-[28px] bg-brand-900 p-6 text-white shadow-soft lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-100">
            Admin Panel
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Clinic Management</h1>
          <p className="mt-2 text-brand-100">
            Manage appointments, doctor availability, and patient emails.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin"
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium"
          >
            Appointments
          </Link>
          <Link
            href="/admin/doctors"
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium"
          >
            Doctors
          </Link>
          <SignOutButton />
        </div>
      </div>
      {children}
    </div>
  );
}
