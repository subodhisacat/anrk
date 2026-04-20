"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { CalendarDays, CreditCard, Mail, Phone, UserRound } from "lucide-react";

import type { Doctor } from "@/lib/types";
import { startEsewaCheckout } from "@/lib/actions/public";
import { toCurrency } from "@/lib/utils";

type BookingFormProps = {
  doctors: Doctor[];
  bookingFee: number;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-2xl bg-brand-700 px-5 py-4 font-semibold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Preparing secure payment..." : "Continue to Secure Payment"}
    </button>
  );
}

const inputClassName =
  "w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-200";

export function BookingForm({ doctors, bookingFee }: BookingFormProps) {
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [availabilityMessage, setAvailabilityMessage] = useState(
    "Choose a doctor and date to load available time slots."
  );
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!doctorId || !date) {
      setSlots([]);
      setAvailabilityMessage("Choose a doctor and date to load available time slots.");
      return;
    }

    startTransition(async () => {
      const response = await fetch(
        `/api/appointments/availability?doctorId=${doctorId}&date=${date}`,
        {
          cache: "no-store"
        }
      );

      const payload = (await response.json()) as { slots: string[]; message: string };
      setSlots(payload.slots || []);
      setAvailabilityMessage(payload.message);
    });
  }, [doctorId, date]);

  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <form action={startEsewaCheckout} className="space-y-5 rounded-3xl border border-brand-100 bg-white p-6 shadow-soft sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="flex items-center gap-2 text-sm font-medium text-ink">
              <UserRound className="h-4 w-4" />
              Patient Name
            </span>
            <input
              name="patient_name"
              required
              placeholder="Enter patient name"
              className={inputClassName}
            />
          </label>

          <label className="space-y-2">
            <span className="flex items-center gap-2 text-sm font-medium text-ink">
              <Phone className="h-4 w-4" />
              Phone
            </span>
            <input
              name="phone"
              required
              placeholder="9866XXXXXX"
              className={inputClassName}
            />
          </label>
        </div>

        <label className="space-y-2">
          <span className="flex items-center gap-2 text-sm font-medium text-ink">
            <Mail className="h-4 w-4" />
            Email
          </span>
          <input
            type="email"
            name="email"
            required
            placeholder="Email is required for booking notifications"
            className={inputClassName}
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Select Doctor</span>
            <select
              name="doctor_id"
              required
              value={doctorId}
              onChange={(event) => setDoctorId(event.target.value)}
              className={inputClassName}
            >
              <option value="">Choose a doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialization}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="flex items-center gap-2 text-sm font-medium text-ink">
              <CalendarDays className="h-4 w-4" />
              Appointment Date
            </span>
            <input
              type="date"
              name="appointment_date"
              required
              min={minDate}
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className={inputClassName}
            />
          </label>
        </div>

        <label className="space-y-2">
          <span className="text-sm font-medium text-ink">Available Time Slots</span>
          <select
            name="appointment_time"
            required
            disabled={!slots.length || isPending}
            className={inputClassName}
          >
            <option value="">
              {isPending ? "Loading slots..." : "Select a time slot"}
            </option>
            {slots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500">{availabilityMessage}</p>
        </label>

        <SubmitButton />
      </form>

      <aside className="rounded-3xl bg-brand-900 p-6 text-white shadow-soft sm:p-8">
        <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand-100">
          Booking Summary
        </span>
        <h3 className="mt-5 text-2xl font-semibold">Secure online booking</h3>
        <p className="mt-3 text-brand-100">
          Your appointment is confirmed only after your eSewa payment is
          successfully verified.
        </p>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-accent" />
            <span className="text-sm font-medium text-brand-100">
              Booking fee
            </span>
          </div>
          <p className="mt-3 text-3xl font-semibold">{toCurrency(bookingFee)}</p>
        </div>

        <ul className="mt-8 space-y-3 text-sm text-brand-50">
          <li>Dynamic time slots prevent double booking.</li>
          <li>Email is mandatory for automated appointment updates.</li>
          <li>Our team can confirm, cancel, reschedule, and send email updates.</li>
        </ul>
      </aside>
    </div>
  );
}
