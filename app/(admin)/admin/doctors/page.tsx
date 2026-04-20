import { upsertDoctorAction, deleteDoctorAction } from "@/lib/actions/admin";
import { getDoctors } from "@/lib/booking";
import { WEEK_DAYS } from "@/lib/constants";

export default async function AdminDoctorsPage() {
  const doctors = await getDoctors();

  return (
    <div className="space-y-8">
      <section className="rounded-[28px] border border-brand-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-semibold text-ink">Add a doctor</h2>
        <form action={upsertDoctorAction} className="mt-5 space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <input
              name="name"
              placeholder="Doctor name"
              className="rounded-2xl border border-brand-100 px-4 py-3"
            />
            <input
              name="specialization"
              placeholder="Specialization"
              className="rounded-2xl border border-brand-100 px-4 py-3"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            {WEEK_DAYS.map((day) => (
              <label
                key={day}
                className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm"
              >
                <input type="checkbox" name="available_days" value={day} />
                {day}
              </label>
            ))}
          </div>
          <button
            type="submit"
            className="rounded-full bg-brand-700 px-5 py-3 font-semibold text-white"
          >
            Save Doctor
          </button>
        </form>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {doctors.map((doctor) => (
          <article
            key={doctor.id}
            className="rounded-[28px] border border-brand-100 bg-white p-6 shadow-soft"
          >
            <h3 className="text-xl font-semibold text-ink">{doctor.name}</h3>
            <p className="mt-2 text-brand-700">{doctor.specialization}</p>
            <form action={upsertDoctorAction} className="mt-6 space-y-4">
              <input type="hidden" name="id" value={doctor.id} />
              <input
                name="name"
                defaultValue={doctor.name}
                className="w-full rounded-2xl border border-brand-100 px-4 py-3"
              />
              <input
                name="specialization"
                defaultValue={doctor.specialization}
                className="w-full rounded-2xl border border-brand-100 px-4 py-3"
              />
              <div className="flex flex-wrap gap-3">
                {WEEK_DAYS.map((day) => (
                  <label
                    key={day}
                    className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      name="available_days"
                      value={day}
                      defaultChecked={doctor.available_days.includes(day)}
                    />
                    {day}
                  </label>
                ))}
              </div>
              <button
                type="submit"
                className="rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white"
              >
                Update
              </button>
            </form>
            <form action={deleteDoctorAction} className="mt-4">
              <input type="hidden" name="doctor_id" value={doctor.id} />
              <button className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600">
                Delete Doctor
              </button>
            </form>
          </article>
        ))}
      </section>
    </div>
  );
}
