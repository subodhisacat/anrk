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
      "Appointments are confirmed only after your eSewa payment is verified securely."
  },
  {
    icon: MailCheck,
    title: "Automatic email updates",
    description:
      "Booking, confirmation, cancellation, and reschedule notifications are sent automatically."
  },
  {
    icon: ShieldCheck,
    title: "Helpful clinic support",
    description:
      "Our clinic team can help with appointments, scheduling updates, and follow-up support."
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
            description="Book appointments online, reach the clinic easily, and get timely updates before and after your visit."
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
              Clinic Team Login
            </Link>
          </div>
        </div>

        <div className="rounded-[28px] bg-brand-900 p-8 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-100">
            How Booking Works
          </p>
          <ol className="mt-6 space-y-5">
            <li>
              <p className="font-semibold">1. Choose your doctor and time</p>
              <p className="text-sm text-brand-100">
                Pick your doctor, preferred date, and an available time slot.
              </p>
            </li>
            <li>
              <p className="font-semibold">2. Pay securely with eSewa</p>
              <p className="text-sm text-brand-100">
                Complete your booking payment through eSewa in a secure checkout.
              </p>
            </li>
            <li>
              <p className="font-semibold">3. Get instant booking confirmation</p>
              <p className="text-sm text-brand-100">
                Once payment is confirmed, your appointment is booked automatically.
              </p>
            </li>
            <li>
              <p className="font-semibold">4. Receive updates when needed</p>
              <p className="text-sm text-brand-100">
                Our team can help with confirmations, rescheduling, cancellations, and email updates.
              </p>
            </li>
          </ol>
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="Doctors"
          title="Available dentists"
          description="Meet the dentists available for consultation and choose the one that fits your needs."
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
