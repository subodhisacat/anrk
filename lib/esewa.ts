import crypto from "crypto";

import { getBaseUrl } from "@/lib/utils";

export type EsewaDecodedResponse = {
  status: string;
  signature: string;
  transaction_code: string;
  total_amount: number | string;
  transaction_uuid: string;
  product_code: string;
  signed_field_names: string;
};

export function getEsewaMerchantCode() {
  return process.env.ESEWA_MERCHANT_CODE || "EPAYTEST";
}

export function getEsewaBaseUrl() {
  return process.env.ESEWA_BASE_URL || "https://rc-epay.esewa.com.np";
}

export function getEsewaStatusUrl() {
  return process.env.ESEWA_STATUS_URL || "https://rc.esewa.com.np";
}

export function signEsewaMessage(message: string) {
  return crypto
    .createHmac("sha256", process.env.ESEWA_SECRET_KEY || "")
    .update(message)
    .digest("base64");
}

export function buildEsewaPayload(transactionUuid: string, totalAmount: number) {
  const productCode = getEsewaMerchantCode();
  const amount = totalAmount.toString();
  const message = `total_amount=${amount},transaction_uuid=${transactionUuid},product_code=${productCode}`;

  return {
    amount,
    tax_amount: "0",
    total_amount: amount,
    transaction_uuid: transactionUuid,
    product_code: productCode,
    product_service_charge: "0",
    product_delivery_charge: "0",
    success_url: `${getBaseUrl()}/payment/success`,
    failure_url: `${getBaseUrl()}/payment/failure`,
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature: signEsewaMessage(message)
  };
}

export function decodeEsewaSuccessPayload(data: string): EsewaDecodedResponse {
  const decoded = Buffer.from(data, "base64").toString("utf-8");
  return JSON.parse(decoded) as EsewaDecodedResponse;
}

export function verifyEsewaResponseSignature(payload: EsewaDecodedResponse) {
  const message = `transaction_code=${payload.transaction_code},status=${payload.status},total_amount=${payload.total_amount},transaction_uuid=${payload.transaction_uuid},product_code=${payload.product_code},signed_field_names=${payload.signed_field_names}`;

  return signEsewaMessage(message) === payload.signature;
}

export async function verifyEsewaTransactionStatus({
  productCode,
  transactionUuid,
  totalAmount
}: {
  productCode: string;
  transactionUuid: string;
  totalAmount: number | string;
}) {
  const query = new URLSearchParams({
    product_code: productCode,
    transaction_uuid: transactionUuid,
    total_amount: totalAmount.toString()
  });

  const response = await fetch(
    `${getEsewaStatusUrl()}/api/epay/transaction/status/?${query.toString()}`,
    {
      cache: "no-store"
    }
  );

  if (!response.ok) {
    throw new Error("Unable to verify transaction with eSewa.");
  }

  return response.json() as Promise<{
    status: string;
    ref_id?: string | null;
    transaction_uuid: string;
    product_code: string;
    total_amount: number;
  }>;
}
