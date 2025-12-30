import { NextResponse } from "next/server";
import { connectToDatabase } from "@/database/db";
import { ObjectId } from "mongodb";
import { sendBookingNotification } from "@/lib/mail";

// Force dynamic to prevent caching issues (users not seeing new bookings)
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const monkId = searchParams.get("monkId");
    const userEmail = searchParams.get("userEmail"); // Get email from params

    // FIX: Allow searching by either monkId OR userEmail
    if (!monkId && !userEmail) {
      return NextResponse.json({ message: "Missing search parameter (monkId or userEmail)" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    
    // Build query dynamically
    const query: any = {};
    
    if (monkId) {
        query.monkId = monkId;
    }
    if (userEmail) {
        query.userEmail = userEmail;
    }
    
    // Optional date filter
    if (searchParams.get("date")) {
        query.date = searchParams.get("date");
    }

    const bookings = await db.collection("bookings")
        .find(query)
        // Sort by Date ascending (so upcoming meetings are top), then Time
        .sort({ date: 1, time: 1 }) 
        .toArray();

    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching bookings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { monkId, date, time, userName, userEmail, serviceId, note } = body; 

    const { db } = await connectToDatabase();

    // 1. Check Availability
    // We check if a slot is taken for this specific Monk
    const existing = await db.collection("bookings").findOne({
      monkId,
      date,
      time,
      status: { $ne: "rejected" } // If previous was rejected, slot is free
    });

    if (existing) {
      return NextResponse.json({ message: "Slot already taken" }, { status: 409 });
    }

    // 2. Fetch Monk & Service Details (For the Email Notification)
    let monk = null;
    if (ObjectId.isValid(monkId)) {
        monk = await db.collection("users").findOne({ _id: new ObjectId(monkId) });
    }

    let serviceName = "Spiritual Session";
    
    if (serviceId) {
        // Check standard services collection (uses ObjectId)
        if (ObjectId.isValid(serviceId)) {
            const serviceDoc = await db.collection("services").findOne({ _id: new ObjectId(serviceId) });
            if (serviceDoc) {
                 serviceName = serviceDoc.title?.en || serviceDoc.title?.mn || serviceName;
            }
        }
        
        // If not found, check inside the monk's profile (uses UUID strings)
        if (serviceName === "Spiritual Session" && monk && monk.services) {
             const embedded = monk.services.find((s: any) => s.id === serviceId);
             if (embedded) {
                 serviceName = embedded.name?.en || embedded.name?.mn || serviceName;
             }
        }
    }

    // 3. Save Booking
    const newBooking = {
      monkId,
      clientId: body.userId || null,
      clientName: userName,
      serviceName: { en: serviceName, mn: serviceName }, 
      date,
      time,
      userEmail,
      note,
      status: 'pending',
      createdAt: new Date()
    };

    const result = await db.collection("bookings").insertOne(newBooking);

    // 4. Send Email
    // Wrapped in try/catch so booking succeeds even if email fails
    try {
        await sendBookingNotification({
          userEmail,
          userName,
          monkName: monk?.name?.en || monk?.name?.mn || "The Monk",
          serviceName: serviceName,
          date,
          time
        });
    } catch (emailError) {
        console.error("Failed to send email:", emailError);
    }

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error: any) {
    console.error("Booking Error:", error);
    return NextResponse.json({ message: "Booking failed", error: error.message }, { status: 500 });
  }
}