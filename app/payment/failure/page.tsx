import Link from "next/link";

export default function PaymentFailurePage() {
  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-red-200 bg-white p-8 shadow-soft">
      <h1 className="text-2xl font-semibold text-ink">Payment was not completed</h1>
      <p className="mt-3 text-slate-600">
        Your appointment was not booked because the payment was not completed.
        You can safely try again with another time slot if needed.
      </p>
      <Link
        href="/book"
        className="mt-6 inline-flex rounded-full bg-brand-700 px-5 py-3 font-semibold text-white"
      >
        Try Booking Again
      </Link>
    </div>
  );
}
