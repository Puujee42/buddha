import { NextResponse } from "next/server";
import { connectToDatabase } from "@/database/db";
import { ObjectId } from "mongodb";
import { sendBookingStatusUpdate } from "@/lib/mail"; // Import the new helper

type Props = {
  params: Promise<{ id: string }>;
};

// PATCH: Update booking status (Accept/Reject)
export async function PATCH(request: Request, props: Props) {
  try {
    const params = await props.params;
    const { id } = params;

    const body = await request.json();
    const { status } = body;

    if (!status || !['confirmed', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid Booking ID format" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const bookingId = new ObjectId(id);

    // 1. FETCH BOOKING DETAILS FIRST
    // We need this data to send the email (email, names, dates)
    const booking = await db.collection("bookings").findOne({ _id: bookingId });

    if (!booking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }

    // 2. UPDATE THE STATUS IN DB
    await db.collection("bookings").updateOne(
      { _id: bookingId },
      { 
        $set: { 
          status: status,
          updatedAt: new Date()
        } 
      }
    );

    // 3. FETCH MONK DETAILS (Optional, for better email name)
    // If your booking doesn't store monkName, fetch it from users
    let monkName = "The Monk";
    if (booking.monkId) {
        // Handle monkId being string or ObjectId
        const monkQuery = ObjectId.isValid(booking.monkId) ? new ObjectId(booking.monkId) : booking.monkId;
        // @ts-ignore - Assuming you handle the type check
        const monk = await db.collection("users").findOne({ _id: monkQuery });
        if (monk) {
            monkName = monk.name?.en || monk.name?.mn || "The Monk";
        }
    }

    // 4. SEND EMAIL NOTIFICATION
    if (booking.userEmail) {
        // Resolve Service Name (It might be an object {en, mn} or a string)
        const serviceName = typeof booking.serviceName === 'object' 
            ? (booking.serviceName.en || booking.serviceName.mn) 
            : booking.serviceName;

        await sendBookingStatusUpdate({
            userEmail: booking.userEmail,
            userName: booking.clientName || "Seeker",
            monkName: monkName,
            serviceName: serviceName || "Spiritual Session",
            date: booking.date,
            time: booking.time,
            status: status
        });
    }

    return NextResponse.json({ 
      message: `Booking ${status} successfully`, 
      success: true
    });

  } catch (error: any) {
    console.error("Update Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE remains the same...
export async function DELETE(request: Request, props: Props) {
  try {
    const params = await props.params;
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid Booking ID" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const result = await db.collection("bookings").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
        return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Booking deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: "Error deleting", error: error.message }, { status: 500 });
  }
}