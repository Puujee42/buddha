import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/database/db";
import { Message } from "@/database/types";

export async function GET(req: NextRequest) {
  const bookingId = req.nextUrl.searchParams.get("bookingId");

  if (!bookingId) {
    return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });
  }

  try {
    const { db } = await connectToDatabase();
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
    const { bookingId, senderId, senderName, text } = await req.json();

    if (!bookingId || !senderId || !text) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    
    const message: Message = {
      bookingId,
      senderId,
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
