import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/database/db";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();

    const { db } = await connectToDatabase();

    // Update the User record. 
    // monkStatus: "pending" -> This triggers it to show up in Admin Dashboard
    await db.collection("users").updateOne(
      { clerkId: clerkUser.id },
      {
        $set: {
          ...body, 
          monkStatus: "pending",
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    return NextResponse.json({ message: "Application received" });

  } catch (error: any) {
    console.error("Monk Apply Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}