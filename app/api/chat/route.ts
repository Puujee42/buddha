import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/database/db";
import { Message } from "@/database/types";
import { currentUser } from "@clerk/nextjs/server";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  const bookingId = req.nextUrl.searchParams.get("bookingId");

  if (!bookingId) {
    return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });
  }

  try {
    const user = await currentUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    
    // 1. Fetch Booking to check permissions
    // Validate bookingId format first if needed, assuming it's an ObjectId string
    if (!ObjectId.isValid(bookingId)) {
         return NextResponse.json({ error: "Invalid bookingId" }, { status: 400 });
    }
    
    const booking = await db.collection("bookings").findOne({ _id: new ObjectId(bookingId) });
    if (!booking) {
        return NextResponse.json({ error: "Booking not found" }, { status: 404 });
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
            console.error("Error fetching monk for chat auth", e);
        }
    }

    if (!isClient && !isMonk && !isAdmin) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const messages = await db
      .collection<Message>("messages")
      .find({ bookingId })
      .sort({ createdAt: 1 })
      .toArray();

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { bookingId, text, senderName: bodySenderName } = await req.json();

    if (!bookingId || !text) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await currentUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await connectToDatabase();

    // 1. Fetch Booking
    if (!ObjectId.isValid(bookingId)) {
         return NextResponse.json({ error: "Invalid bookingId" }, { status: 400 });
    }
    const booking = await db.collection("bookings").findOne({ _id: new ObjectId(bookingId) });
    if (!booking) {
        return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // 2. Authorization Check
    const isClient = booking.clientId === user.id;
    const isAdmin = user.publicMetadata.role === "admin";
    let isMonk = false;
    
    if (booking.monkId) {
        const monkProfile = await db.collection("users").findOne({ _id: new ObjectId(booking.monkId) });
        if (monkProfile && monkProfile.clerkId === user.id) {
            isMonk = true;
        }
    }

    if (!isClient && !isMonk && !isAdmin) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 3. Construct Message with Verified Sender
    const senderName = user.fullName || bodySenderName || "User";

    const message: Message = {
      bookingId,
      senderId: user.id, // Enforce authenticated user ID
      senderName,
      text,
      createdAt: new Date(),
    };

    const result = await db.collection<Message>("messages").insertOne(message);
    
    return NextResponse.json({ ...message, _id: result.insertedId });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
