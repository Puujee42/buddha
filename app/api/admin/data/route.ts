import { NextResponse } from "next/server";
import { connectToDatabase } from "@/database/db";
import { currentUser } from "@clerk/nextjs/server"; // Server-side auth check

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await currentUser();

    // SERVER-SIDE SECURITY CHECK
    if (!user || user.publicMetadata.role !== 'admin') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { db } = await connectToDatabase();

    // 1. Fetch All Users
    const users = await db.collection("users").find({}).toArray();

    // 2. Fetch All Bookings
    const bookings = await db.collection("bookings")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // 3. Fetch Standard Services
    const standardServices = await db.collection("services").find({}).toArray();

    // 4. Extract Monk Services (for approval)
    // We use a Map to deduplicate services by their ID
    const servicesMap = new Map<string, any>();

    // First, add all standard services
    standardServices.forEach((svc: any) => {
      // Ensure we have a string ID. Fallback to _id if id is missing.
      const key = svc.id ? svc.id.toString() : svc._id.toString();

      servicesMap.set(key, {
        ...svc,
        id: key, // Normalize id to string
        _id: svc._id ? svc._id.toString() : key,
        source: "standard",
        isShared: true, // Standard services are available to all or many
        monkName: { mn: "Standard Service", en: "Standard Service" }
      });
    });

    // Then process monk services
    users
      .filter((u: any) => u.role === 'monk' && u.services && Array.isArray(u.services))
      .forEach((monk: any) => {
        monk.services.forEach((svc: any) => {
          // Ensure we have a string ID
          const key = svc.id ? svc.id.toString() : (svc._id ? svc._id.toString() : null);

          if (!key) return; // Skip invalid services

          if (servicesMap.has(key)) {
            // Service already exists (either standard or from another monk)
            const existing = servicesMap.get(key);
            // If it was already a monk service, mark it as multiple monks
            if (existing.source === "monk") {
              existing.monkName = { mn: "Олон лам", en: "Multiple Monks" };
              existing.isShared = true;
            }
            // We could accumulate stats here if needed, e.g. count providers
          } else {
            // New unique service found from a monk
            servicesMap.set(key, {
              ...svc,
              id: key,
              _id: key, // Use the internal ID as _id
              source: "monk",
              monkId: monk._id.toString(),
              monkName: monk.name,
              type: "Monk Service",
              status: svc.status || 'active'
            });
          }
        });
      });

    const allServices = Array.from(servicesMap.values());

    // 5. Calculate Stats
    const stats = {
      totalUsers: users.length,
      totalMonks: users.filter((u: any) => u.role === 'monk').length,
      totalBookings: bookings.length,
      revenue: bookings.reduce((acc: number, curr: any) => {
        return curr.status === 'completed' ? acc + 1 : acc;
      }, 0)
    };

    return NextResponse.json({
      users,
      bookings,
      services: allServices,
      stats
    });

  } catch (error) {
    console.error("Admin Data Error:", error);
    return NextResponse.json({ message: "Admin Data Error" }, { status: 500 });
  }
}