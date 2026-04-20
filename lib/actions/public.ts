"use server";

import { redirect } from "next/navigation";
import { randomUUID } from "crypto";

import { bookingSchema } from "@/lib/validations";
import { assertSlotAvailable, getDoctors } from "@/lib/booking";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function startEsewaCheckout(formData: FormData) {
  const parsed = bookingSchema.safeParse({
    patient_name: formData.get("patient_name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    doctor_id: formData.get("doctor_id"),
    appointment_date: formData.get("appointment_date"),
    appointment_time: formData.get("appointment_time")
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Invalid booking form.");
  }

  const booking = parsed.data;
  const doctors = await getDoctors();
  const doctor = doctors.find((item) => item.id === booking.doctor_id);

  if (!doctor) {
    throw new Error("Selected doctor was not found.");
  }

  await assertSlotAvailable(
    booking.doctor_id,
    booking.appointment_date,
    booking.appointment_time
  );

  const supabase = createSupabaseAdminClient();
  const transactionUuid = `${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-${randomUUID().slice(0, 8)}`;
  const amount = Number(process.env.CLINIC_BOOKING_FEE || 500);

  const { data, error } = await supabase
    .from("payment_sessions")
    .insert({
      patient_name: booking.patient_name,
      email: booking.email,
      phone: booking.phone,
      doctor_id: booking.doctor_id,
      appointment_date: booking.appointment_date,
      appointment_time: booking.appointment_time,
      amount,
      transaction_uuid: transactionUuid,
      status: "pending"
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Could not create payment session.");
  }

  redirect(`/payment/esewa?session=${data.id}`);
}
