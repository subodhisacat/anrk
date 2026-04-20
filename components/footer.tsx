import { CLINIC } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-brand-100 bg-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 text-sm text-slate-600 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <h3 className="font-semibold text-ink">{CLINIC.name}</h3>
          <p className="mt-2">{CLINIC.location}</p>
        </div>
        <div>
          <h3 className="font-semibold text-ink">Contact</h3>
          <p className="mt-2">{CLINIC.phones.join(", ")}</p>
          <p>{CLINIC.email}</p>
        </div>
        <div>
          <h3 className="font-semibold text-ink">Hours</h3>
          <p className="mt-2">Sunday to Friday</p>
          <p>09:00 AM to 05:30 PM</p>
        </div>
      </div>
    </footer>
  );
}
