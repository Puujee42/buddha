import { NextResponse } from "next/server";
import { connectToDatabase } from "@/database/db";
import { ObjectId } from "mongodb";

// Define the type for the route props
type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, props: Props) {
  try {
    // 1. AWAIT THE PARAMS (This is the fix)
    const params = await props.params;
    const { id } = params;

    console.log("🔍 Searching for Monk ID:", id); // This will now show the correct ID

    const { db } = await connectToDatabase();

    let query = {};

    // 2. SEARCH LOGIC (Robust check for both ObjectId and String formats)
    if (ObjectId.isValid(id)) {
      query = {
        $or: [
          { _id: new ObjectId(id) }, // Check as standard ObjectId
          { _id: id }                // Check as String (just in case)
        ]
      };
    } else {
      query = { _id: id };
    }

    // 3. EXECUTE QUERY
    const monk = await db.collection("monks").findOne(query);

    if (!monk) {
      console.error("❌ Monk not found in DB for ID:", id);
      return NextResponse.json(
        { message: "Monk not found" },
        { status: 404 }
      );
    }

    // 4. SUCCESS
    return NextResponse.json(monk);

  } catch (error: any) {
    console.error("🔥 Server Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}