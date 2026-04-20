import { NextResponse } from "next/server";

import { getAvailableSlots } from "@/lib/booking";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const doctorId = searchParams.get("doctorId");
  const date = searchParams.get("date");

  if (!doctorId || !date) {
    return NextResponse.json(
      {
        slots: [],
        message: "Select a doctor and date first."
      },
      { status: 400 }
    );
  }

  try {
    const slots = await getAvailableSlots(doctorId, date);
    return NextResponse.json({
      slots,
      message: slots.length
        ? "Available slots loaded successfully."
        : "No slots available for the selected day."
    });
  } catch (error) {
    return NextResponse.json(
      {
        slots: [],
        message: (error as Error).message
      },
      { status: 500 }
    );
  }
}
