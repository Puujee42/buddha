import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "@/database/db";

type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, props: Props) {
  try {
    // 1. Await params (Required in Next.js 15)
    const params = await props.params;
    const { id } = params;

    // 2. Connect
    const {db} = await connectToDatabase();

    let query = {};

    // 3. Robust Search (Matches either ObjectId or String ID)
    // This allows your fallback data ("1") and real DB data (ObjectId) to both work
    if (ObjectId.isValid(id)) {
      query = {
        $or: [
          { _id: new ObjectId(id) }, 
          { _id: id } 
        ]
      };
    } else {
      query = { _id: id };
    }

    const service = await db.collection("services").findOne(query);

    if (!service) {
      return NextResponse.json(
        { message: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(service);

  } catch (error: any) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}