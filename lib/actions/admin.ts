"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdminUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  appointmentStatusSchema,
  customEmailSchema,
  doctorSchema,
  rescheduleSchema
} from "@/lib/validations";
import {
  assertSlotAvailable,
  getAppointmentWithDoctor
} from "@/lib/booking";
import {
  sendAppointmentStatusEmail,
  sendCustomAppointmentEmail
} from "@/lib/email";

export async function signInAdminAction(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/admin");
}

export async function signOutAdminAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function updateAppointmentStatusAction(formData: FormData) {
  await requireAdminUser();

  const parsed = appointmentStatusSchema.safeParse({
    appointment_id: formData.get("appointment_id"),
    status: formData.get("status")
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Invalid status update.");
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("appointments")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.appointment_id);

  if (error) {
    throw new Error(error.message);
  }

  const appointment = await getAppointmentWithDoctor(parsed.data.appointment_id);

  if (parsed.data.status === "confirmed") {
    await sendAppointmentStatusEmail({
      appointment,
      status: "confirmed"
    });
  }

  if (parsed.data.status === "cancelled") {
    await sendAppointmentStatusEmail({
      appointment,
      status: "cancelled"
    });
  }

  revalidatePath("/admin");
}

export async function rescheduleAppointmentAction(formData: FormData) {
  await requireAdminUser();

  const parsed = rescheduleSchema.safeParse({
    appointment_id: formData.get("appointment_id"),
    appointment_date: formData.get("appointment_date"),
    appointment_time: formData.get("appointment_time")
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Invalid reschedule request.");
  }

  const supabase = createSupabaseAdminClient();
  const existing = await getAppointmentWithDoctor(parsed.data.appointment_id);

  await assertSlotAvailable(
    existing.doctor_id,
    parsed.data.appointment_date,
    parsed.data.appointment_time
  );

  const { error } = await supabase
    .from("appointments")
    .update({
      appointment_date: parsed.data.appointment_date,
      appointment_time: parsed.data.appointment_time,
      status: "rescheduled"
    })
    .eq("id", parsed.data.appointment_id);

  if (error) {
    throw new Error(error.message);
  }

  const appointment = await getAppointmentWithDoctor(parsed.data.appointment_id);
  await sendAppointmentStatusEmail({
    appointment,
    status: "rescheduled"
  });

  revalidatePath("/admin");
}

export async function sendCustomEmailAction(formData: FormData) {
  await requireAdminUser();

  const parsed = customEmailSchema.safeParse({
    appointment_id: formData.get("appointment_id"),
    subject: formData.get("subject"),
    message: formData.get("message")
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Invalid email payload.");
  }

  const appointment = await getAppointmentWithDoctor(parsed.data.appointment_id);
  await sendCustomAppointmentEmail({
    appointment,
    subject: parsed.data.subject,
    message: parsed.data.message
  });

  revalidatePath("/admin");
}

export async function upsertDoctorAction(formData: FormData) {
  await requireAdminUser();

  const idValue = String(formData.get("id") || "");
  const availableDays = formData
    .getAll("available_days")
    .map((value) => String(value));

  const parsed = doctorSchema.safeParse({
    id: idValue || undefined,
    name: formData.get("name"),
    specialization: formData.get("specialization"),
    available_days: availableDays
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Invalid doctor payload.");
  }

  const supabase = createSupabaseAdminClient();
  const { id, ...payload } = parsed.data;

  const query = id
    ? supabase.from("doctors").update(payload).eq("id", id)
    : supabase.from("doctors").insert(payload);

  const { error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/doctors");
  revalidatePath("/doctors");
  revalidatePath("/book");
}

export async function deleteDoctorAction(formData: FormData) {
  await requireAdminUser();
  const doctorId = String(formData.get("doctor_id") || "");

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("doctors").delete().eq("id", doctorId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/doctors");
  revalidatePath("/doctors");
  revalidatePath("/book");
}
