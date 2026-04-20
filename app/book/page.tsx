import { BookingForm } from "@/components/booking-form";
import { SectionHeading } from "@/components/section-heading";
import { getDoctors } from "@/lib/booking";

export default async function BookPage() {
  const doctors = await getDoctors();
  const bookingFee = Number(process.env.CLINIC_BOOKING_FEE || 500);

  return (
    <div className="space-y-8 pb-10">
      <SectionHeading
        eyebrow="Appointment"
        title="Book a dental appointment"
        description="Fill in your details, choose a dentist and time slot, then continue to secure eSewa payment. Your appointment is confirmed once the payment is successfully verified."
      />
      <BookingForm doctors={doctors} bookingFee={bookingFee} />
    </div>
  );
}
