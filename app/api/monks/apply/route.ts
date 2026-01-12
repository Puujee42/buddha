import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/database/db";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();

    const { db } = await connectToDatabase();

    // Fetch all services from the services collection
    const allServices = await db.collection("services").find({}).toArray();

    // Map services to the format expected in user.services array
    const serviceRefs = allServices.map((svc: any) => ({
      id: svc.id || svc._id.toString(),
      name: svc.name,
      price: svc.price,
      duration: svc.duration,
      status: 'active'
    }));

    // Update the User record. 
    // monkStatus: "pending" -> This triggers it to show up in Admin Dashboard
    // services: all services from the services collection
    await db.collection("users").updateOne(
      { clerkId: clerkUser.id },
      {
        $set: {
          ...body,
          monkStatus: "pending",
          services: serviceRefs, // Assign all services immediately
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    return NextResponse.json({ message: "Application received" });

  } catch (error: any) {
    console.error("Monk Apply Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}