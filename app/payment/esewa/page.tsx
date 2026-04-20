import { notFound } from "next/navigation";

import { PaymentRedirectForm } from "@/components/payment-redirect-form";
import { buildEsewaPayload, getEsewaBaseUrl } from "@/lib/esewa";
import { getPaymentSessionById } from "@/lib/booking";

type EsewaPageProps = {
  searchParams: Promise<{
    session?: string;
  }>;
};

export default async function EsewaPage({ searchParams }: EsewaPageProps) {
  const { session } = await searchParams;

  if (!session) {
    notFound();
  }

  const paymentSession = await getPaymentSessionById(session);
  const payload = buildEsewaPayload(
    paymentSession.transaction_uuid,
    paymentSession.amount
  );

  return (
    <div className="mx-auto max-w-2xl py-12">
      <PaymentRedirectForm
        action={`${getEsewaBaseUrl()}/api/epay/main/v2/form`}
        fields={payload}
      />
    </div>
  );
}
