import Link from "next/link";
import { CalendarCheck2, CreditCard, MailCheck, ShieldCheck } from "lucide-react";

import { DoctorCard } from "@/components/doctor-card";
import { Hero } from "@/components/hero";
import { SectionHeading } from "@/components/section-heading";
import { CLINIC } from "@/lib/constants";
import { getDoctors } from "@/lib/booking";

const features = [
  {
    icon: CalendarCheck2,
    title: "Live appointment booking",
    description:
      "Patients can choose a doctor, date, and currently available slot in real time."
  },
  {
    icon: CreditCard,
    title: "Verified eSewa payments",
    description:
      "Appointments are stored only after the eSewa success callback is verified on the server."
  },
  {
    icon: MailCheck,
    title: "Automatic email updates",
    description:
      "Booking, confirmation, cancellation, and reschedule notifications are sent automatically."
  },
  {
    icon: ShieldCheck,
    title: "Protected admin panel",
    description:
      "Supabase Auth protects the clinic dashboard for managing doctors and appointments."
  }
];

export default async function HomePage() {
  const doctors = await getDoctors();

  return (
    <div className="space-y-16 pb-10">
      <Hero />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <article
              key={feature.title}
              className="rounded-3xl border border-brand-100 bg-white p-6 shadow-soft"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-ink">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-8 rounded-[32px] bg-white p-8 shadow-soft lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <SectionHeading
            eyebrow="Clinic"
            title="Dental care with a smoother booking experience"
            description="This system gives ANRK Dental Care Clinic a polished online presence with booking, payments, notifications, and admin tools in one place."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-brand-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
                Location
              </p>
              <p className="mt-2 text-lg font-semibold text-ink">{CLINIC.location}</p>
            </div>
            <div className="rounded-3xl bg-brand-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
                Contact
              </p>
              <p className="mt-2 text-lg font-semibold text-ink">
                {CLINIC.phones.join(", ")}
              </p>
            </div>
          </div>
          <div className="mt-8 flex gap-4">
            <Link
              href="/book"
              className="rounded-full bg-brand-700 px-5 py-3 font-semibold text-white"
            >
              Book Now
            </Link>
            <Link
              href="/admin"
              className="rounded-full border border-brand-200 px-5 py-3 font-semibold text-brand-700"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>

        <div className="rounded-[28px] bg-brand-900 p-8 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-100">
            Workflow
          </p>
          <ol className="mt-6 space-y-5">
            <li>
              <p className="font-semibold">1. Patient books a slot</p>
              <p className="text-sm text-brand-100">
                Doctor, date, and time are selected from dynamic availability.
              </p>
            </li>
            <li>
              <p className="font-semibold">2. Patient pays with eSewa</p>
              <p className="text-sm text-brand-100">
                The system redirects to the eSewa test gateway with signed fields.
              </p>
            </li>
            <li>
              <p className="font-semibold">3. Server verifies payment</p>
              <p className="text-sm text-brand-100">
                The success callback is validated before the appointment is saved.
              </p>
            </li>
            <li>
              <p className="font-semibold">4. Admin manages the booking</p>
              <p className="text-sm text-brand-100">
                Confirm, cancel, reschedule, and send custom emails from the dashboard.
              </p>
            </li>
          </ol>
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Doctors"
          title="Available dentists"
          description="Doctor profiles are loaded from Supabase and can be managed directly from the admin panel."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </section>
    </div>
  );
}
