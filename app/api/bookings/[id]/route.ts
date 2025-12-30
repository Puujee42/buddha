import { NextResponse } from "next/server";
import { connectToDatabase } from "@/database/db";
import { ObjectId } from "mongodb";
import { sendBookingStatusUpdate } from "@/lib/mail"; 

type Props = {
  params: Promise<{ id: string }>;
};

// PATCH: Update booking status (Accept/Reject/Complete)
export async function PATCH(request: Request, props: Props) {
  try {
    const params = await props.params;
    const { id } = params;

    const body = await request.json();
    const { status } = body;

    // 1. FIX: Add 'completed' to the valid statuses list
    const validStatuses = ['confirmed', 'rejected', 'pending', 'completed'];

    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid Booking ID format" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const bookingId = new ObjectId(id);

    // 2. Fetch booking details
    const booking = await db.collection("bookings").findOne({ _id: bookingId });

    if (!booking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }

    // 3. Update the status in DB
    await db.collection("bookings").updateOne(
      { _id: bookingId },
      { 
        $set: { 
          status: status,
          updatedAt: new Date()
        } 
      }
    );

    // 4. Send Email Notification (ONLY for Confirmed or Rejected)
    // We skip 'completed' to avoid sending unnecessary emails or breaking the mail helper
    if (['confirmed', 'rejected'].includes(status) && booking.userEmail) {
        
        let monkName = "The Monk";
        if (booking.monkId) {
            const monkQuery = ObjectId.isValid(booking.monkId) ? new ObjectId(booking.monkId) : booking.monkId;
            const monk = await db.collection("users").findOne({ _id: monkQuery });
            if (monk) {
                monkName = monk.name?.en || monk.name?.mn || "The Monk";
            }
        }

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
            status: status as 'confirmed' | 'rejected'
        });
    }

    return NextResponse.json({ 
      message: `Booking marked as ${status}`, 
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

// DELETE remains the same
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