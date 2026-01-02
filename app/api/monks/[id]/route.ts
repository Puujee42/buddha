import { NextResponse } from "next/server";
import { connectToDatabase } from "@/database/db";
import { ObjectId } from "mongodb";

type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, props: Props) {
  try {
    const params = await props.params;
    const { id } = params;

    const { db } = await connectToDatabase();

    // 1. Build a robust query
    // We check if 'id' matches the MongoDB _id OR the clerkId
    let query: any = {
      $or: [
        { clerkId: id },           // Match Clerk ID
        { _id: id }                // Match String _id
      ]
    };

    // Only attempt to convert to ObjectId if the string is valid 24-char hex
    if (ObjectId.isValid(id)) {
      query.$or.push({ _id: new ObjectId(id) });
    }

    // 2. IMPORTANT: Search in the "users" collection (not "monks")
    // We also enforce that the role must be "monk"
    const monk = await db.collection("users").findOne({
      $and: [
        query,
        { role: "monk" } 
      ]
    });

    if (!monk) {
      return NextResponse.json(
        { message: "Monk profile not found" },
        { status: 404 }
      );
    }

    // 3. Serialize _id to string before returning
    const serializedMonk = {
      ...monk,
      _id: monk._id.toString()
    };

    return NextResponse.json(serializedMonk);

  } catch (error: any) {
    console.error("🔥 Server Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, props: Props) {
  try {
    const params = await props.params;
    const { id } = params;
    const body = await request.json();

    const { db } = await connectToDatabase();

    // Prevent updating sensitive fields via this route if necessary
    // For now, we allow updating the fields provided in the body
    const { _id, clerkId, role, ...updateFields } = body;

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(id), role: "monk" },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Monk profile not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Profile updated", success: true });

  } catch (error: any) {
    console.error("Profile Update Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}