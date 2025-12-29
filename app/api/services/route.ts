import { connectToDatabase } from "@/database/db";
import { NextResponse } from "next/server";// Import from your new helper

export async function GET() {
  try {
    const {db} = await connectToDatabase();
    
    // Fetch all services
    const services = await db.collection("services").find({}).toArray();

    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {db} = await connectToDatabase();

    // Basic validation
    if (!body.title || !body.type || !body.price) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await db.collection("services").insertOne({
        ...body,
        createdAt: new Date(),
    });

    return NextResponse.json({ message: "Service created", id: result.insertedId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}