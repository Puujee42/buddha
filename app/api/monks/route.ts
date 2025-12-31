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

    // SAVE AS CLIENT, BUT MARK AS PENDING MONK
    const result = await db.collection("users").updateOne(
      { clerkId: data.clerkId },
      {
        $set: {
          ...updateFields,
          role: "client", // Keeps them as client until approved
          monkStatus: "pending", // Flag for Admin to see
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

    return NextResponse.json({ message: "Application submitted.", result });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to save profile.", error: error.message },
      { status: 500 }
    );
  }
}