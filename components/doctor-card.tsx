import type { Doctor } from "@/lib/types";

type DoctorCardProps = {
  doctor: Doctor;
};

export function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <article className="rounded-3xl border border-brand-100 bg-white p-6 shadow-soft">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-lg font-semibold text-brand-700">
        {doctor.name
          .split(" ")
          .map((part) => part[0])
          .slice(0, 2)
          .join("")}
      </div>
      <h3 className="mt-5 text-xl font-semibold text-ink">{doctor.name}</h3>
      <p className="mt-2 text-brand-700">{doctor.specialization}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {doctor.available_days.map((day) => (
          <span
            key={day}
            className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700"
          >
            {day}
          </span>
        ))}
      </div>
    </article>
  );
}
