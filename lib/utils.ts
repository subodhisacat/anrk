import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

import { CLINIC } from "@/lib/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDisplayDate(date: string) {
  return format(new Date(`${date}T00:00:00`), "EEEE, MMMM d, yyyy");
}

export function formatDisplayDateTime(date: string, time: string) {
  return `${formatDisplayDate(date)} at ${time}`;
}

export function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

export function toCurrency(amount: number) {
  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0
  }).format(amount);
}

export function clinicContactLine() {
  return `${CLINIC.location} | ${CLINIC.phones.join(", ")}`;
}
