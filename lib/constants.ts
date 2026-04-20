export const CLINIC = {
  name: "ANRK Dental Care Clinic",
  location: "Radhe Radhe, Bhaktapur, Nepal",
  phones: ["9866049030", "015926536"],
  email: "appointments@anrkdental.com",
  whatsappPhone: "9779866049030"
};

export const APPOINTMENT_STATUSES = [
  "pending",
  "confirmed",
  "cancelled",
  "rescheduled"
] as const;

export const PAYMENT_STATUSES = ["paid", "unpaid"] as const;

export const WEEK_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
] as const;
