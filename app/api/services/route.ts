import { NextResponse } from "next/server";
import { connectToDatabase } from "@/database/db";

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    // 1. Fetch "Official" Services from the 'services' collection
    const standardServices = await db.collection("services").find({}).toArray();

    // 2. Fetch "Monk" Services from the 'users' collection
    // We only want users who are monks and actually have services listed
    const monks = await db.collection("users").find({
      role: "monk",
      services: { $exists: true, $not: { $size: 0 } }
    }).toArray();

    // 3. Extract and Flatten Monk Services
    // We map over the monks, then map over their services to add context (like monk name/ID)
    const monkServices = monks.flatMap((monk) => {
      if (!monk.services || !Array.isArray(monk.services)) return [];
      
      return monk.services.map((svc: any) => ({
        ...svc,
        _id: svc.id, // Ensure it has a top-level _id (using the UUID generated in the form)
        source: "monk", // Flag to help UI distinguish
        monkId: monk._id.toString(),
        providerName: monk.name, // Pass the monk's name object
        type: "Monk Service", // Fallback type
        // Ensure price is a number
        price: Number(svc.price)
      }));
    });

    // 4. Combine both lists
    const allServices = [...standardServices, ...monkServices];

    return NextResponse.json(allServices, { status: 200 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { db } = await connectToDatabase();

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