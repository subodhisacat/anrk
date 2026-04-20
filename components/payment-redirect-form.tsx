"use client";

import { useEffect, useRef } from "react";

type PaymentRedirectFormProps = {
  action: string;
  fields: Record<string, string>;
};

export function PaymentRedirectForm({
  action,
  fields
}: PaymentRedirectFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    formRef.current?.submit();
  }, []);

  return (
    <div className="rounded-3xl border border-brand-100 bg-white p-8 shadow-soft">
      <h1 className="text-2xl font-semibold text-ink">Redirecting to eSewa</h1>
      <p className="mt-3 text-slate-600">
        Your booking details are ready. You will be redirected to eSewa in a
        moment to complete your payment securely.
      </p>
      <form ref={formRef} action={action} method="POST" className="mt-6 space-y-2">
        {Object.entries(fields).map(([key, value]) => (
          <input key={key} type="hidden" name={key} value={value} />
        ))}
        <button
          type="submit"
          className="rounded-full bg-brand-700 px-5 py-3 font-semibold text-white"
        >
          Continue to Payment
        </button>
      </form>
    </div>
  );
}
