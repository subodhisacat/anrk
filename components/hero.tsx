import Link from "next/link";

import { CLINIC } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[32px] bg-brand-900 bg-hero-grid px-6 py-16 text-white shadow-soft sm:px-10 lg:px-14">
      <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,rgba(244,183,64,0.28),transparent_50%)] lg:block" />
      <div className="relative max-w-3xl">
        <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-brand-100">
          Trusted dental care in Bhaktapur
        </span>
        <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl">
          Book your dental appointment online with {CLINIC.name}.
        </h1>
        <p className="mt-5 max-w-2xl text-base text-brand-50 sm:text-lg">
          Quick online booking, secure eSewa payment, and clear appointment
          updates to make your visit easier from start to finish.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/book"
            className="rounded-full bg-accent px-6 py-3 font-semibold text-ink transition hover:translate-y-[-1px]"
          >
            Book an Appointment
          </Link>
          <Link
            href="/doctors"
            className="rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Meet the Doctors
          </Link>
        </div>
      </div>
    </section>
  );
}
