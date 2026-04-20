import { z } from "zod";

import { APPOINTMENT_STATUSES } from "@/lib/constants";

export const bookingSchema = z.object({
  patient_name: z.string().min(2, "Patient name is required."),
  phone: z.string().min(7, "Phone number is required."),
  email: z.string().email("A valid email is required."),
  doctor_id: z.string().uuid("Please select a doctor."),
  appointment_date: z.string().min(1, "Please choose a date."),
  appointment_time: z.string().min(1, "Please select a time slot.")
});

export const doctorSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, "Doctor name is required."),
  specialization: z.string().min(2, "Specialization is required."),
  available_days: z
    .array(z.string())
    .min(1, "Choose at least one available day.")
});

export const appointmentStatusSchema = z.object({
  appointment_id: z.string().uuid(),
  status: z.enum(APPOINTMENT_STATUSES)
});

export const rescheduleSchema = z.object({
  appointment_id: z.string().uuid(),
  appointment_date: z.string().min(1, "New date is required."),
  appointment_time: z.string().min(1, "New time is required.")
});

export const customEmailSchema = z.object({
  appointment_id: z.string().uuid(),
  subject: z.string().min(3, "Subject is required."),
  message: z.string().min(10, "Message is required.")
});
