import { DoctorCard } from "@/components/doctor-card";
import { SectionHeading } from "@/components/section-heading";
import { getDoctors } from "@/lib/booking";

export default async function DoctorsPage() {
  const doctors = await getDoctors();

  return (
    <div className="space-y-8 pb-10">
      <SectionHeading
        eyebrow="Doctors"
        title="Meet the clinic team"
        description="Each doctor's availability is used to drive the public slot picker and avoid invalid bookings."
      />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
}
