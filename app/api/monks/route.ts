import { NextResponse } from "next/server";
import { connectToDatabase } from "@/database/db";
import { Monk } from "@/database/types";

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
    const monks = await db.collection("users").find({ role: "monk" }).toArray() as unknown as Monk[];

    // Serialize _id to string to avoid serialization issues in Next.js response
    let serializedMonks = monks.map(monk => ({
      ...monk,
      _id: monk._id?.toString() ?? ""
    }));

    // SORTING: Special monks (Master/Тэргүүн or >10 years exp) first
    serializedMonks.sort((a, b) => {
      const isASpecial = (a.title?.en?.includes("Master") || a.title?.mn?.includes("Тэргүүн") || (a.yearsOfExperience || 0) > 10);
      const isBSpecial = (b.title?.en?.includes("Master") || b.title?.mn?.includes("Тэргүүн") || (b.yearsOfExperience || 0) > 10);

      if (isASpecial && !isBSpecial) return -1;
      if (!isASpecial && isBSpecial) return 1;
      return 0;
    });

    return NextResponse.json(serializedMonks);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch monks.", error: error.message },
      { status: 500 }
    );
  }
}