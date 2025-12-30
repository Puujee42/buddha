import { NextResponse } from "next/server";
import { connectToDatabase } from "@/database/db";
import { ObjectId } from "mongodb";

type Props = {
  params: Promise<{ id: string }>;
};

export async function DELETE(request: Request, props: Props) {
  try {
    const params = await props.params;
    const { id } = params;

    const { db } = await connectToDatabase();

    // Construct query: Try to match by ObjectId (MongoDB ID) OR String (Clerk ID)
    let query = {};
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    } else {
      query = { clerkId: id };
    }

    // Delete the user
    const result = await db.collection("users").deleteOne(query);

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Optional: Delete associated bookings? 
    // For now, we'll keep bookings for history, or you could delete them here too.

    return NextResponse.json({ message: "User deleted successfully" });

  } catch (error: any) {
    console.error("Delete User Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}