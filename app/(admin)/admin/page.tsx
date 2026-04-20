import { TIME_SLOTS } from "@/lib/time-slots";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getDoctors } from "@/lib/booking";
import {
  rescheduleAppointmentAction,
  sendCustomEmailAction,
  updateAppointmentStatusAction
} from "@/lib/actions/admin";
import { formatDisplayDateTime } from "@/lib/utils";

type AdminPageProps = {
  searchParams: Promise<{
    doctor?: string;
    status?: string;
    date?: string;
  }>;
};

export default async function AdminDashboardPage({
  searchParams
}: AdminPageProps) {
  const { doctor, status, date } = await searchParams;
  const supabase = createSupabaseAdminClient();
  const doctors = await getDoctors();

  let query = supabase
    .from("appointments")
    .select(
      "id, patient_name, email, phone, doctor_id, appointment_date, appointment_time, status, payment_status, transaction_id, notes, created_at, updated_at, doctors(id, name, specialization)"
    )
    .order("appointment_date", { ascending: true })
    .order("appointment_time", { ascending: true });

  if (doctor) {
    query = query.eq("doctor_id", doctor);
  }

  if (status) {
    query = query.eq("status", status);
  }

  if (date) {
    query = query.eq("appointment_date", date);
  }

  const { data: appointments, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[28px] border border-brand-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-semibold text-ink">Filter appointments</h2>
        <form className="mt-5 grid gap-4 lg:grid-cols-4">
          <select
            name="doctor"
            defaultValue={doctor || ""}
            className="rounded-2xl border border-brand-100 px-4 py-3"
          >
            <option value="">All doctors</option>
            {doctors.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <select
            name="status"
            defaultValue={status || ""}
            className="rounded-2xl border border-brand-100 px-4 py-3"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rescheduled">Rescheduled</option>
          </select>

          <input
            type="date"
            name="date"
            defaultValue={date || ""}
            className="rounded-2xl border border-brand-100 px-4 py-3"
          />

          <button
            type="submit"
            className="rounded-2xl bg-brand-700 px-5 py-3 font-semibold text-white"
          >
            Apply Filters
          </button>
        </form>
      </section>

      <section className="space-y-5">
        {appointments?.length ? (
          appointments.map((appointment) => (
            <article
              key={appointment.id}
              className="rounded-[28px] border border-brand-100 bg-white p-6 shadow-soft"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-semibold text-ink">
                      {appointment.patient_name}
                    </h3>
                    <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
                      {appointment.status}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                      {appointment.payment_status}
                    </span>
                  </div>
                  <p className="mt-2 text-slate-600">
                    {appointment.email} | {appointment.phone}
                  </p>
                  <p className="mt-2 text-slate-700">
                    <strong>Doctor:</strong> {appointment.doctors?.name} (
                    {appointment.doctors?.specialization})
                  </p>
                  <p className="mt-2 text-slate-700">
                    <strong>Schedule:</strong>{" "}
                    {formatDisplayDateTime(
                      appointment.appointment_date,
                      appointment.appointment_time
                    )}
                  </p>
                  <p className="mt-2 text-slate-700">
                    <strong>Transaction ID:</strong>{" "}
                    {appointment.transaction_id || "Not available"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <form action={updateAppointmentStatusAction}>
                    <input type="hidden" name="appointment_id" value={appointment.id} />
                    <input type="hidden" name="status" value="confirmed" />
                    <button className="rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white">
                      Confirm
                    </button>
                  </form>
                  <form action={updateAppointmentStatusAction}>
                    <input type="hidden" name="appointment_id" value={appointment.id} />
                    <input type="hidden" name="status" value="cancelled" />
                    <button className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600">
                      Cancel
                    </button>
                  </form>
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <form
                  action={rescheduleAppointmentAction}
                  className="rounded-3xl bg-brand-50 p-5"
                >
                  <input type="hidden" name="appointment_id" value={appointment.id} />
                  <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
                    Reschedule
                  </h4>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <input
                      type="date"
                      name="appointment_date"
                      defaultValue={appointment.appointment_date}
                      className="rounded-2xl border border-brand-100 px-4 py-3"
                    />
                    <select
                      name="appointment_time"
                      defaultValue={appointment.appointment_time}
                      className="rounded-2xl border border-brand-100 px-4 py-3"
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="mt-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-700"
                  >
                    Save New Schedule
                  </button>
                </form>

                <form
                  action={sendCustomEmailAction}
                  className="rounded-3xl bg-slate-50 p-5"
                >
                  <input type="hidden" name="appointment_id" value={appointment.id} />
                  <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
                    Send Custom Email
                  </h4>
                  <div className="mt-4 space-y-3">
                    <input
                      name="subject"
                      placeholder="Custom email subject"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                    />
                    <textarea
                      name="message"
                      rows={4}
                      placeholder="Write a custom message for the patient"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                    />
                  </div>
                  <button
                    type="submit"
                    className="mt-4 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Send Email
                  </button>
                </form>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[28px] border border-dashed border-brand-200 bg-white p-8 text-center text-slate-600">
            No appointments found for the selected filters.
          </div>
        )}
      </section>
    </div>
  );
}
