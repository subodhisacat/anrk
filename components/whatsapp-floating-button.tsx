import Link from "next/link";

import { CLINIC } from "@/lib/constants";

export function WhatsAppFloatingButton() {
  const message = encodeURIComponent(
    `Hello ${CLINIC.name}, I would like to ask about an appointment.`
  );

  return (
    <Link
      href={`https://wa.me/${CLINIC.whatsappPhone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with ANRK Dental Care Clinic on WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-3 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(37,211,102,0.32)] transition hover:scale-[1.02] hover:bg-[#1ebe5d] sm:bottom-6 sm:right-6"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/18">
        <img
          src="https://www.logo.wine/a/logo/WhatsApp/WhatsApp-Logo.wine.svg"
          alt=""
          aria-hidden="true"
          className="h-10 w-10 object-contain"
        />
      </span>
      <span className="hidden sm:inline">Chat on WhatsApp</span>
    </Link>
  );
}
