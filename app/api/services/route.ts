import { NextResponse } from "next/server";
import { connectToDatabase } from "@/database/db";
import { currentUser } from "@clerk/nextjs/server";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const { db } = await connectToDatabase();

    // AUTOMATION: Check and populate empty service arrays for all monks
    const allServicesInCollection = await db.collection("services").find({}).toArray();

    if (allServicesInCollection.length > 0) {
      // Map to service reference format
      const serviceRefs = allServicesInCollection.map((svc: any) => ({
        id: svc.id || svc._id.toString(),
        name: svc.name,
        price: svc.price,
        duration: svc.duration,
        status: 'active'
      }));

      // Find monks with empty/missing services and populate them
      await db.collection("users").updateMany(
        {
          role: "monk",
          $or: [
            { services: { $exists: false } },
            { services: { $size: 0 } },
            { services: null }
          ]
        },
        {
          $set: {
            services: serviceRefs,
            updatedAt: new Date()
          }
        }
      );
    }

    // 1. Fetch "Official" Services from the 'services' collection
    const standardServices = await db.collection("services").find({}).toArray();

    // 2. Fetch "Monk" Services from the 'users' collection
    // We only want users who are monks and actually have services listed
    const monks = await db.collection("users").find({
      role: "monk",
      services: { $exists: true, $not: { $size: 0 } }
    }).toArray();

    // 3. Extract and Flatten Monk Services
    const monkServices = monks.flatMap((monk) => {
      if (!monk.services || !Array.isArray(monk.services)) return [];

      return monk.services
        // FILTER: Only show active/approved services (or those without status which might be legacy)
        .filter((svc: any) => svc.status === 'active' || !svc.status)
        .map((svc: any) => ({
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
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.publicMetadata.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Only admins can create standard services" }, { status: 403 });
    }

    const {
      name,
      title,
      type,
      price,
      duration,
      desc,
      subtitle,
      image,
      quote,
      id
    } = await request.json();

    if (!price || !type) {
      return NextResponse.json({ error: "Missing required fields (price, type)" }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Construct service object ensuring schema compliance
    const newService = {
      id: id || new ObjectId().toString(),
      name,
      title,
      type,
      price: Number(price),
      duration,
      desc,
      subtitle,
      image,
      quote,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("services").insertOne(newService);

    // Broadcast this new service to ALL monks
    await db.collection("users").updateMany(
      { role: "monk" },
      {
        $push: {
          services: {
            id: newService.id,
            name: newService.name,
            price: newService.price,
            duration: newService.duration,
            status: 'active'
          }
        }
      } as any
    );

    return NextResponse.json({ message: "Service created", id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Service Creation Error:", error);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}