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

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    
    // Delete from 'services' collection
    const result = await db.collection("services").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Service deleted successfully" });

  } catch (error: any) {
    return NextResponse.json({ message: "Error deleting service", error: error.message }, { status: 500 });
  }
}