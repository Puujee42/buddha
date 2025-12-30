import { NextResponse } from "next/server";
import { connectToDatabase } from "@/database/db";

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    // Fetch from 'users' collection where role is 'monk'
    const monks = await db.collection("users").find({ role: "monk" }).toArray();
    
    // Serialize _id to string to avoid serialization issues in Next.js response
    const serializedMonks = monks.map(monk => ({
      ...monk,
      _id: monk._id.toString()
    }));
    
    return NextResponse.json(serializedMonks);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch monks.", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const data = await request.json();

    // Ensure we have a unique identifier (clerkId is preferred)
    if (!data.clerkId) {
      return NextResponse.json(
        { message: "Missing clerkId." },
        { status: 400 }
      );
    }

    // Remove _id if present in the payload to avoid immutable field error
    const { _id, ...updateFields } = data;

    const result = await db.collection("users").updateOne(
      { clerkId: data.clerkId },
      {
        $set: {
          ...updateFields,
          role: "monk",
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
          karma: 0,
          meditationDays: 0,
          totalMerits: 0,
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ message: "Monk profile saved.", result });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to save monk profile.", error: error.message },
      { status: 500 }
    );
  }
}
