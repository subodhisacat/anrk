import Link from "next/link";

import { CLINIC } from "@/lib/constants";

const links = [
  { href: "/", label: "Home" },
  { href: "/doctors", label: "Doctors" },
  { href: "/book", label: "Book Appointment" },
  { href: "/admin", label: "Admin" }
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/20 bg-brand-900/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 text-white sm:px-6 lg:px-8">
        <div>
          <Link href="/" className="text-lg font-semibold tracking-wide">
            {CLINIC.name}
          </Link>
          <p className="text-xs text-brand-100">{CLINIC.location}</p>
        </div>
        <nav className="flex items-center gap-4 text-sm font-medium">
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
    </header>
  );
}
