import { NextResponse } from "next/server";
import { connectToDatabase } from "@/database/db";
import { ObjectId } from "mongodb";

type Props = {
  params: Promise<{ id: string }>;
};

// PATCH: Update the services array (Add/Edit/Delete)
export async function PATCH(request: Request, props: Props) {
  try {
    const params = await props.params;
    const { id } = params;
    const body = await request.json();
    const { services } = body; // Expecting the full updated array of services

    if (!services || !Array.isArray(services)) {
      return NextResponse.json({ message: "Invalid services data" }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Determine query (Clerk ID or MongoDB ID)
    let query = {};
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    } else {
      query = { clerkId: id };
    }

    const result = await db.collection("users").updateOne(
      query,
      { $set: { services: services } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Monk not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Services updated successfully", success: true });

  } catch (error: any) {
    console.error("Service Update Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}