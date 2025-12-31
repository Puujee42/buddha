import { NextResponse } from "next/server";
import { connectToDatabase } from "@/database/db";
import { ObjectId } from "mongodb";

type Props = {
  params: Promise<{ id: string }>;
};

// PATCH: Approve or Reject Monk Application
export async function PATCH(request: Request, props: Props) {
  try {
    const params = await props.params;
    const { id } = params; // MongoDB ID of the user
    const { action } = await request.json(); // 'approve' or 'reject'

    if (!ObjectId.isValid(id)) return NextResponse.json({ message: "Invalid ID" }, { status: 400 });

    const { db } = await connectToDatabase();

    let updateDoc = {};

    if (action === 'approve') {
        updateDoc = {
            role: "monk", // Promote to Monk
            monkStatus: "approved",
            updatedAt: new Date()
        };
    } else if (action === 'reject') {
        updateDoc = {
            role: "client", // Ensure they stay Client
            monkStatus: "rejected",
            updatedAt: new Date()
        };
    } else {
        return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    const result = await db.collection("users").updateOne(
        { _id: new ObjectId(id) },
        { $set: updateDoc }
    );

    return NextResponse.json({ message: `Application ${action}ed successfully`, result });

  } catch (error: any) {
    return NextResponse.json({ message: "Error", error: error.message }, { status: 500 });
  }
}