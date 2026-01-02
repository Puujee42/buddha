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
    const body = await request.json();

    const { db } = await connectToDatabase();

    // 1. Build query to find user by _id or clerkId
    let query: any = {
      $or: [
        { clerkId: id },
        { _id: id }
      ]
    };

    if (ObjectId.isValid(id)) {
      query.$or.push({ _id: new ObjectId(id) });
    }

    // Exclude immutable fields
    const { _id, clerkId, role, ...updateFields } = body;

    // We use upsert=true so if the client doesn't exist in our DB yet, they get created.
    // But we need to make sure we set the clerkId if we are inserting.
    // The 'id' param is likely the clerkId if coming from the frontend for a new user.
    
    // However, updateOne with upsert might complain if we don't handle $setOnInsert for required fields if it's a new doc.
    // For now, let's assume if it's an update, we just $set.
    // If we want to support "Creating a client profile on first edit", we might need more logic.
    
    // Let's try simple update first.
    const result = await db.collection("users").updateOne(
        query,
        { $set: updateFields },
        { upsert: false } // Let's keep it false for safety, or check logic.
    );

    if (result.matchedCount === 0) {
        // If not found, and we want to allow creating a client profile (since dashboard handles "temp_client")
        // We can try to insert.
        // But we need to know it is indeed a client.
        // Let's assume the frontend passes enough info or we just fail for now and rely on "sign-up" flow? 
        // Wait, there is no explicit sign-up for clients, they just sign-in via Clerk.
        // So we SHOULD probably upsert.
        
        await db.collection("users").updateOne(
            { clerkId: id }, // Assume id is clerkId
            { 
                $set: { 
                    ...updateFields, 
                    role: "client", 
                    createdAt: new Date(),
                    clerkId: id 
                } 
            },
            { upsert: true }
        );
    }

    return NextResponse.json({ message: "User profile updated", success: true });

  } catch (error: any) {
    console.error("User Update Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
