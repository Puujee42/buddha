import { NextResponse } from "next/server";
import { connectToDatabase } from "@/database/db";
import { ObjectId } from "mongodb";
import { sendBookingStatusUpdate } from "@/lib/mail"; 
import { currentUser } from "@clerk/nextjs/server";

type Props = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const { id } = params;
    const { status } = await req.json(); // 'confirmed', 'rejected', etc.

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { db } = await connectToDatabase();

    // 1. Fetch the booking to check ownership
    const booking = await db.collection("bookings").findOne({ _id: new ObjectId(id) });

    if (!booking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }

    // 2. Authorization Check
    const isClient = booking.clientId === user.id;
    const isAdmin = user.publicMetadata.role === "admin";
    
    let isMonk = false;
    let monkProfile = null;
    
    if (booking.monkId) {
       try {
           monkProfile = await db.collection("users").findOne({ _id: new ObjectId(booking.monkId) });
           if (monkProfile && monkProfile.clerkId === user.id) {
               isMonk = true;
           }
       } catch (e) {
           console.error("Error fetching monk for auth check", e);
       }
    }

    if (!isMonk && !isAdmin && !isClient) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    
    // Validation: Only Monks/Admins can confirm or reject
    if (status === 'confirmed' || status === 'rejected') {
        if (!isMonk && !isAdmin) {
            return NextResponse.json({ message: "Clients cannot confirm bookings" }, { status: 403 });
        }
    }

    // 3. Update the Booking
    await db.collection("bookings").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } }
    );

    // 4. Send Email Notification (The Missing Logic)
    if (status === 'confirmed' || status === 'rejected') {
        // Ensure we have monk profile for the name if not fetched yet (e.g. if admin did the action)
        if (!monkProfile && booking.monkId) {
             monkProfile = await db.collection("users").findOne({ _id: new ObjectId(booking.monkId) });
        }
        
        const monkName = monkProfile?.name?.en || monkProfile?.name?.mn || "The Monk";
        const serviceName = booking.serviceName?.en || booking.serviceName?.mn || "Spiritual Session";
        
        if (booking.userEmail) {
             await sendBookingStatusUpdate({
                 userEmail: booking.userEmail,
                 userName: booking.clientName || "Seeker",
                 monkName,
                 serviceName,
                 date: booking.date,
                 time: booking.time,
                 status
             });
        }
    }

    return NextResponse.json({ message: "Booking updated", success: true });

  } catch (error: any) {
    console.error("Booking PATCH Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
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
    
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    
    // 1. Fetch booking to check permissions
    const booking = await db.collection("bookings").findOne({ _id: new ObjectId(id) });
    if (!booking) {
        return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }

    // 2. Authorization Check
    const isClient = booking.clientId === user.id;
    const isAdmin = user.publicMetadata.role === "admin";
    
    let isMonk = false;
    if (booking.monkId) {
       try {
           const monkProfile = await db.collection("users").findOne({ _id: new ObjectId(booking.monkId) });
           if (monkProfile && monkProfile.clerkId === user.id) {
               isMonk = true;
           }
       } catch (e) {
           console.error("Error fetching monk for auth check", e);
       }
    }

    if (!isClient && !isMonk && !isAdmin) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const result = await db.collection("bookings").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
        return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Booking deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: "Error deleting", error: error.message }, { status: 500 });
  }
}