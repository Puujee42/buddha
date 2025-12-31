import { NextResponse } from "next/server";
import { connectToDatabase } from "@/database/db";

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const data = await request.json();

    if (!data.clerkId) {
      return NextResponse.json({ message: "Missing clerkId." }, { status: 400 });
    }

    const { _id, ...updateFields } = data;

    // IMPORTANT: Set role directly to "monk" and remove monkStatus
    const result = await db.collection("users").updateOne(
      { clerkId: data.clerkId },
      {
        $set: {
          ...updateFields,
          role: "monk", // Now directly set to monk
          monkStatus: "approved", // Optional, but helps ensure state is consistent if old data had it
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

    return NextResponse.json({ message: "Monk profile saved.", result }); // Updated message
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to save profile.", error: error.message },
      { status: 500 }
    );
  }
}

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