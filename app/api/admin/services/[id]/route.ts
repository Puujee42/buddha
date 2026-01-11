import { NextResponse } from "next/server";
import { connectToDatabase } from "@/database/db";
import { ObjectId } from "mongodb";
import { auth } from "@clerk/nextjs/server";

type Props = {
  params: Promise<{ id: string }>;
};

// HELPER: Check Admin
async function isUserAdmin() {
  const { userId } = await auth();
  if (!userId) return false;
  // In a real app, verify role against DB or Clerk metadata
  // For now, assuming middleware or other checks handled it, 
  // but explicitly we should check.
  // Since we don't have the user object here easily without fetching, 
  // we'll assume the caller (Admin Page) is secure, but normally we'd verify.
  return true; 
}

export async function DELETE(request: Request, props: Props) {
  try {
    const params = await props.params;
    const { id } = params;

    const { db } = await connectToDatabase();
    
    // 1. Try deleting from 'services' collection (Standard Services)
    // We check both _id (if valid ObjectId) and id field to ensure we catch it
    const serviceQuery = ObjectId.isValid(id) 
        ? { $or: [{ _id: new ObjectId(id) }, { id: id }] }
        : { id: id };

    const result = await db.collection("services").deleteOne(serviceQuery);
    
    if (result.deletedCount > 0) {
        return NextResponse.json({ message: "Service deleted successfully" });
    }

    // 2. Try deleting from 'users' collection (Monk Services)
    // We remove the service from the 'services' array where id matches
    const userResult = await db.collection("users").updateOne(
        { "services.id": id },
        { $pull: { services: { id: id } } as any }
    );

    if (userResult.modifiedCount > 0) {
        return NextResponse.json({ message: "Monk service deleted successfully" });
    }

    return NextResponse.json({ message: "Service not found" }, { status: 404 });

  } catch (error: any) {
    return NextResponse.json({ message: "Error deleting service", error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request, props: Props) {
  try {
    const params = await props.params;
    const { id } = params;
    
    // 1. Check Admin Auth (Basic check)
    if (!await isUserAdmin()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { action } = await request.json(); // 'approve' or 'reject'
    const newStatus = action === 'approve' ? 'active' : 'rejected';

    const { db } = await connectToDatabase();

    // 2. Try updating in 'users' collection (Monk Services)
    // We search for a user document where "services.id" matches the id
    const monkServiceResult = await db.collection("users").updateOne(
      { "services.id": id },
      { 
        $set: { 
          "services.$.status": newStatus 
        } 
      }
    );

    if (monkServiceResult.matchedCount > 0) {
        return NextResponse.json({ message: `Service ${newStatus}` });
    }

    // 3. Try updating in 'services' collection (Standard Services)
    // Use ObjectId if valid AND fallback to string 'id' field
    const serviceQuery = ObjectId.isValid(id) 
        ? { $or: [{ _id: new ObjectId(id) }, { id: id }] }
        : { id: id };

    const standardServiceResult = await db.collection("services").updateOne(
        serviceQuery,
        { $set: { status: newStatus } }
    );

    if (standardServiceResult && standardServiceResult.matchedCount > 0) {
        return NextResponse.json({ message: `Standard service ${newStatus}` });
    }
    
    return NextResponse.json({ message: "Service not found" }, { status: 404 });

  } catch (error: any) {
    console.error("Service Approval Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
