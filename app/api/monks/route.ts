import { NextResponse } from "next/server";
import { connectToDatabase } from "@/database/db";

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const monks = await db.collection("monks").find({}).toArray();
    return NextResponse.json(monks);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch monks.", error: error.message },
      { status: 500 }
    );
  }
}
