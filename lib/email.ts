import nodemailer from "nodemailer";
import { Resend } from "resend";

import { CLINIC } from "@/lib/constants";
import type { HydratedAppointment } from "@/lib/types";
import { clinicContactLine, formatDisplayDateTime } from "@/lib/utils";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  return apiKey ? new Resend(apiKey) : null;
}

function getSmtpTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

export async function sendClinicEmail({
  to,
  subject,
  html,
  text
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  const from = process.env.EMAIL_FROM || `${CLINIC.name} <no-reply@example.com>`;
  const resend = getResendClient();

  if (resend) {
    await resend.emails.send({
      from,
      to,
      subject,
      html,
      text
    });
    return;
  }

  const transporter = getSmtpTransporter();

  if (!transporter) {
    throw new Error(
      "No email provider configured. Add RESEND_API_KEY or SMTP credentials."
    );
  }

  await transporter.sendMail({
    from,
    to,
    subject,
    html,
    text
  });
}

function appointmentEmailHtml(
  title: string,
  intro: string,
  appointment: HydratedAppointment,
  extraHtml?: string
) {
  return `
    <div style="font-family: Arial, sans-serif; color: #102422; line-height: 1.6;">
      <h2 style="margin-bottom: 8px;">${title}</h2>
      <p>${intro}</p>
      <div style="padding: 16px; border-radius: 14px; background: #f4fbfa; border: 1px solid #d9f0ec;">
        <p><strong>Patient:</strong> ${appointment.patient_name}</p>
        <p><strong>Doctor:</strong> ${appointment.doctor?.name || "Assigned doctor"}</p>
        <p><strong>Date & Time:</strong> ${formatDisplayDateTime(
          appointment.appointment_date,
          appointment.appointment_time
        )}</p>
        <p><strong>Clinic:</strong> ${CLINIC.name}</p>
        <p><strong>Location:</strong> ${CLINIC.location}</p>
        <p><strong>Contact:</strong> ${CLINIC.phones.join(", ")}</p>
      </div>
      ${extraHtml || ""}
      <p style="margin-top: 18px;">Thank you,<br />${CLINIC.name}</p>
    </div>
  `;
}

function appointmentEmailText(
  title: string,
  intro: string,
  appointment: HydratedAppointment,
  extraText?: string
) {
  return `${title}

${intro}

Patient: ${appointment.patient_name}
Doctor: ${appointment.doctor?.name || "Assigned doctor"}
Date & Time: ${formatDisplayDateTime(
    appointment.appointment_date,
    appointment.appointment_time
  )}
Clinic: ${CLINIC.name}
Location: ${clinicContactLine()}

${extraText || ""}
`;
}

export async function sendAppointmentStatusEmail({
  appointment,
  status,
  customMessage
}: {
  appointment: HydratedAppointment;
  status: "booked" | "confirmed" | "cancelled" | "rescheduled";
  customMessage?: string;
}) {
  const subjectMap = {
    booked: `Appointment booked with ${CLINIC.name}`,
    confirmed: `Appointment confirmed by ${CLINIC.name}`,
    cancelled: `Appointment cancelled by ${CLINIC.name}`,
    rescheduled: `Appointment rescheduled by ${CLINIC.name}`
  };

  const introMap = {
    booked:
      "Your appointment has been booked successfully after payment verification.",
    confirmed: "Your appointment has been confirmed by our clinic team.",
    cancelled: "Your appointment has been cancelled. Please contact us if needed.",
    rescheduled:
      "Your appointment has been rescheduled. Please review the new date and time below."
  };

  await sendClinicEmail({
    to: appointment.email,
    subject: subjectMap[status],
    html: appointmentEmailHtml(
      subjectMap[status],
      introMap[status],
      appointment,
      customMessage ? `<p>${customMessage}</p>` : undefined
    ),
    text: appointmentEmailText(
      subjectMap[status],
      introMap[status],
      appointment,
      customMessage
    )
  });
}

export async function sendCustomAppointmentEmail({
  appointment,
  subject,
  message
}: {
  appointment: HydratedAppointment;
  subject: string;
  message: string;
}) {
  await sendClinicEmail({
    to: appointment.email,
    subject,
    html: appointmentEmailHtml(subject, message, appointment),
    text: appointmentEmailText(subject, message, appointment)
  });
}
