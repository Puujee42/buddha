import { NextResponse } from "next/server";
import { connectToDatabase } from "@/database/db";
import { ObjectId } from "mongodb";

// GET: Fetch booked time slots for a specific Monk and Date
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const monkId = searchParams.get("monkId");
    const date = searchParams.get("date"); // Format: "2025-10-25"

    if (!monkId || !date) {
      return NextResponse.json({ message: "Missing parameters" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    
    // Find all bookings for this monk on this date
    const bookings = await db.collection("bookings").find({
      monkId: monkId, // Stored as string or ObjectId depending on your preference, keeping it simple here
      date: date
    }).toArray();

    // Return just the array of taken times (e.g., ["10:00", "14:00"])
    const takenSlots = bookings.map(b => b.time);

    return NextResponse.json(takenSlots);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching slots" }, { status: 500 });
  }
}

// POST: Save a new booking
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { monkId, date, time, userName, userEmail } = body;

    const { db } = await connectToDatabase();

    // Double-check availability (Race condition prevention)
    const existing = await db.collection("bookings").findOne({
      monkId,
      date,
      time
    });

    if (existing) {
      return NextResponse.json({ message: "Slot already taken" }, { status: 409 });
    }

    // Save booking
    await db.collection("bookings").insertOne({
      monkId,
      date,
      time,
      userName, // Optional: if you have user auth
      userEmail,
      createdAt: new Date()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: "Booking failed" }, { status: 500 });
  }
}