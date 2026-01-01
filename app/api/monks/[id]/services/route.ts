import { NextResponse } from "next/server";
import { connectToDatabase } from "@/database/db";
import { ObjectId } from "mongodb";

type Props = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, props: Props) {
  try {
    const params = await props.params;
    const { id } = params;
    const { services } = await request.json();

    if (!services || !Array.isArray(services)) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Update the 'users' collection so it shows up on the public profile
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { $set: { services: services } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Monk profile not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Services updated", success: true });

  } catch (error: any) {
    console.error("Services Update Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}