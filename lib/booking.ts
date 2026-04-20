import { format } from "date-fns";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type {
  AppointmentWithDoctor,
  DoctorRelation,
  HydratedAppointment,
  Doctor,
  PaymentSession
} from "@/lib/types";
import { TIME_SLOTS } from "@/lib/time-slots";
import {
  decodeEsewaSuccessPayload,
  verifyEsewaResponseSignature,
  verifyEsewaTransactionStatus
} from "@/lib/esewa";
import { sendAppointmentStatusEmail } from "@/lib/email";

export async function getDoctors() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("doctors")
    .select("*")
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return (data || []) as Doctor[];
}

export async function getAvailableSlots(doctorId: string, date: string) {
  const supabase = createSupabaseAdminClient();
  const weekday = format(new Date(`${date}T00:00:00`), "EEEE");

  const { data: doctor, error: doctorError } = await supabase
    .from("doctors")
    .select("id, available_days")
    .eq("id", doctorId)
    .single();

  if (doctorError || !doctor) {
    throw new Error("Doctor not found.");
  }

  if (!(doctor.available_days as string[]).includes(weekday)) {
    return [];
  }

  const { data: appointments, error } = await supabase
    .from("appointments")
    .select("appointment_time")
    .eq("doctor_id", doctorId)
    .eq("appointment_date", date)
    .neq("status", "cancelled");

  if (error) {
    throw new Error(error.message);
  }

  const booked = new Set((appointments || []).map((item) => item.appointment_time));

  return TIME_SLOTS.filter((slot) => !booked.has(slot));
}

export async function assertSlotAvailable(
  doctorId: string,
  date: string,
  time: string
) {
  const slots = await getAvailableSlots(doctorId, date);
  if (!slots.includes(time as (typeof TIME_SLOTS)[number])) {
    throw new Error("That time slot is no longer available.");
  }
}

export async function getAppointmentWithDoctor(appointmentId: string) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("appointments")
    .select(
      "id, patient_name, email, phone, doctor_id, appointment_date, appointment_time, status, payment_status, transaction_id, notes, created_at, updated_at, doctors(id, name, specialization)"
    )
    .eq("id", appointmentId)
    .single();

  if (error || !data) {
    throw new Error("Appointment not found.");
  }

  return normalizeAppointmentWithDoctor(data as AppointmentWithDoctor);
}

export async function getPaymentSessionById(sessionId: string) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("payment_sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (error || !data) {
    throw new Error("Payment session not found.");
  }

  return data as PaymentSession;
}

export async function finalizeEsewaPayment(encodedData: string) {
  const supabase = createSupabaseAdminClient();
  const decoded = decodeEsewaSuccessPayload(encodedData);

  if (decoded.status !== "COMPLETE") {
    throw new Error("Payment is not marked as complete.");
  }

  if (!verifyEsewaResponseSignature(decoded)) {
    throw new Error("Invalid eSewa response signature.");
  }

  const { data: sessionData, error: sessionError } = await supabase
    .from("payment_sessions")
    .select("*")
    .eq("transaction_uuid", decoded.transaction_uuid)
    .single();

  if (sessionError || !sessionData) {
    throw new Error("Booking session was not found.");
  }

  const session = sessionData as PaymentSession;

  if (session.status === "paid" && session.appointment_id) {
    return getAppointmentWithDoctor(session.appointment_id);
  }

  const verification = await verifyEsewaTransactionStatus({
    productCode: decoded.product_code,
    transactionUuid: decoded.transaction_uuid,
    totalAmount: decoded.total_amount
  });

  if (verification.status !== "COMPLETE") {
    throw new Error("eSewa transaction verification failed.");
  }

  await assertSlotAvailable(
    session.doctor_id,
    session.appointment_date,
    session.appointment_time
  );

  const { data: appointment, error: appointmentError } = await supabase
    .from("appointments")
    .insert({
      patient_name: session.patient_name,
      email: session.email,
      phone: session.phone,
      doctor_id: session.doctor_id,
      appointment_date: session.appointment_date,
      appointment_time: session.appointment_time,
      status: "pending",
      payment_status: "paid",
      transaction_id: decoded.transaction_code
    })
    .select("id")
    .single();

  if (appointmentError || !appointment) {
    throw new Error(
      appointmentError?.message || "Appointment could not be created after payment."
    );
  }

  const { error: sessionUpdateError } = await supabase
    .from("payment_sessions")
    .update({
      status: "paid",
      transaction_code: decoded.transaction_code,
      appointment_id: appointment.id
    })
    .eq("id", session.id);

  if (sessionUpdateError) {
    throw new Error(sessionUpdateError.message);
  }

  const hydratedAppointment = await getAppointmentWithDoctor(appointment.id);

  await sendAppointmentStatusEmail({
    appointment: hydratedAppointment,
    status: "booked"
  });

  return hydratedAppointment;
}

export function getDoctorRelation(
  doctors: AppointmentWithDoctor["doctors"]
): DoctorRelation | null {
  if (!doctors) {
    return null;
  }

  return Array.isArray(doctors) ? doctors[0] ?? null : doctors;
}

export function normalizeAppointmentWithDoctor(
  appointment: AppointmentWithDoctor
): HydratedAppointment {
  return {
    ...appointment,
    doctor: getDoctorRelation(appointment.doctors)
  };
}
