import { NextResponse } from "next/server";
import { connectToDatabase } from "@/database/db";
import { ObjectId } from "mongodb";

type Props = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, props: Props) {
  try {
    const params = await props.params;
    const { id } = params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid booking ID" }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // 1. Find the booking
    const booking = await db.collection("bookings").findOne({ _id: new ObjectId(id) });
    if (!booking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }

    // 2. Check if already processed
    if (booking.status === 'completed') {
        return NextResponse.json({ message: "Booking already completed" });
    }

    // 3. Update Monk's Earnings (Add 50,000 as requested)
    const monkId = booking.monkId;
    if (monkId) {
        // monkId can be string or ObjectId in booking, ensure we match correctly
        // In types.ts: monkId: ObjectId | string
        const monkQuery = ObjectId.isValid(monkId) ? { _id: new ObjectId(monkId) } : { _id: monkId };
        
        await db.collection("users").updateOne(
            monkQuery,
            { $inc: { earnings: 50000 } }
        );
    }

    // 4. Delete Chat Messages (Cleanup)
    await db.collection("messages").deleteMany({ bookingId: id });

    // 5. Mark Booking as Completed
    await db.collection("bookings").updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: 'completed', updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true, message: "Booking completed, payment added, and chat history cleaned." });

  } catch (error: any) {
    console.error("Complete Booking Error:", error);
    return NextResponse.json({ message: "Internal Error", error: error.message }, { status: 500 });
  }
}
