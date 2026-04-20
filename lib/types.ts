export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "rescheduled";

export type PaymentStatus = "paid" | "unpaid";

export type Doctor = {
  id: string;
  name: string;
  specialization: string;
  available_days: string[];
  created_at?: string;
  updated_at?: string;
};

export type Appointment = {
  id: string;
  patient_name: string;
  email: string;
  phone: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  status: AppointmentStatus;
  payment_status: PaymentStatus;
  transaction_id: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type AppointmentWithDoctor = Appointment & {
  doctors:
    | {
        id: string;
        name: string;
        specialization: string;
      }
    | {
        id: string;
        name: string;
        specialization: string;
      }[]
    | null;
};

export type DoctorRelation = {
  id: string;
  name: string;
  specialization: string;
};

export type HydratedAppointment = Appointment & {
  doctor: DoctorRelation | null;
};

export type PaymentSession = {
  id: string;
  patient_name: string;
  email: string;
  phone: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  amount: number;
  transaction_uuid: string;
  status: "pending" | "paid" | "failed";
  transaction_code: string | null;
  appointment_id: string | null;
  created_at?: string;
  updated_at?: string;
};
