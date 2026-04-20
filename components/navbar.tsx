"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { CLINIC } from "@/lib/constants";

const links = [
  { href: "/", label: "Home" },
  { href: "/doctors", label: "Doctors" },
  { href: "/book", label: "Book Appointment" },
  { href: "/admin", label: "Admin" }
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/20 bg-brand-900/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-4 text-white sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.jpg"
                alt={`${CLINIC.name} logo`}
                width={52}
                height={52}
                className="h-12 w-12 rounded-full border border-white/15 bg-white object-cover"
              />
              <span className="text-lg font-semibold tracking-wide">
                {CLINIC.name}
              </span>
            </Link>
            <p className="mt-1 max-w-[12rem] text-xs leading-relaxed text-brand-100 sm:max-w-none">
              {CLINIC.location}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition hover:bg-white/10 md:hidden"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <nav className="hidden items-center gap-2 text-sm font-medium md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-2 transition hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {isOpen ? (
          <nav className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4 text-sm font-medium md:hidden">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-2xl px-4 py-3 transition hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>
    </header>
  );
}
