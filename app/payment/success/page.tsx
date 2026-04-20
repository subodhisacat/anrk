import Link from "next/link";

import { finalizeEsewaPayment } from "@/lib/booking";
import { formatDisplayDateTime } from "@/lib/utils";

type SuccessPageProps = {
  searchParams: Promise<{
    data?: string;
  }>;
};

export default async function PaymentSuccessPage({
  searchParams
}: SuccessPageProps) {
  const { data } = await searchParams;

  if (!data) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-red-200 bg-white p-8 shadow-soft">
        <h1 className="text-2xl font-semibold text-ink">Missing payment data</h1>
        <p className="mt-3 text-slate-600">
          eSewa did not return the expected success payload.
        </p>
      </div>
    );
  }

  try {
    const appointment = await finalizeEsewaPayment(data);

    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-brand-100 bg-white p-8 shadow-soft">
        <span className="inline-flex rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand-700">
          Payment verified
        </span>
        <h1 className="mt-4 text-3xl font-semibold text-ink">
          Your appointment is booked
        </h1>
        <p className="mt-4 text-slate-600">
          Your eSewa payment has been confirmed and your appointment is now
          booked. A confirmation email has been sent to {appointment.email}.
        </p>
        <div className="mt-6 rounded-3xl bg-brand-50 p-6">
          <p>
            <strong>Patient:</strong> {appointment.patient_name}
          </p>
          <p className="mt-2">
            <strong>Doctor:</strong> {appointment.doctor?.name}
          </p>
          <p className="mt-2">
            <strong>Date & Time:</strong>{" "}
            {formatDisplayDateTime(
              appointment.appointment_date,
              appointment.appointment_time
            )}
          </p>
          <p className="mt-2">
            <strong>Status:</strong> {appointment.status}
          </p>
        </div>
        <div className="mt-6 flex gap-4">
          <Link
            href="/"
            className="rounded-full bg-brand-700 px-5 py-3 font-semibold text-white"
          >
            Return Home
          </Link>
          <Link
            href="/book"
            className="rounded-full border border-brand-200 px-5 py-3 font-semibold text-brand-700"
          >
            Book Another
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-red-200 bg-white p-8 shadow-soft">
        <h1 className="text-2xl font-semibold text-ink">
          We could not confirm the payment
        </h1>
        <p className="mt-3 text-slate-600">
          {(error as Error).message}
        </p>
        <p className="mt-3 text-sm text-slate-500">
          If the payment was actually completed, the clinic can verify it manually
          from eSewa and contact you.
        </p>
      </div>
    );
  }
}
