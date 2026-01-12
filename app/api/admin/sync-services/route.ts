import { NextResponse } from "next/server";
import { connectToDatabase } from "@/database/db";
import { currentUser } from "@clerk/nextjs/server";

/**
 * Admin-only endpoint to sync all services to all monks
 * Checks all monks and populates their services array if empty
 */
export async function POST(request: Request) {
    try {
        const user = await currentUser();

        // Admin check
        if (!user || user.publicMetadata.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { db } = await connectToDatabase();

        // 1. Fetch all services from the services collection
        const allServices = await db.collection("services").find({}).toArray();

        // 2. Map services to the format expected in user.services array
        const serviceRefs = allServices.map((svc: any) => ({
            id: svc.id || svc._id.toString(),
            name: svc.name,
            price: svc.price,
            duration: svc.duration,
            status: 'active'
        }));

        // 3. Find all monks with empty or missing services array
        const monksWithoutServices = await db.collection("users").find({
            role: "monk",
            $or: [
                { services: { $exists: false } },
                { services: { $size: 0 } },
                { services: null }
            ]
        }).toArray();

        // 4. Update each monk with all services
        const updatePromises = monksWithoutServices.map((monk) =>
            db.collection("users").updateOne(
                { _id: monk._id },
                {
                    $set: {
                        services: serviceRefs,
                        updatedAt: new Date()
                    }
                }
            )
        );

        await Promise.all(updatePromises);

        return NextResponse.json({
            success: true,
            message: `Updated ${monksWithoutServices.length} monks with ${allServices.length} services`,
            updated: monksWithoutServices.length,
            totalServices: allServices.length
        });

    } catch (error: any) {
        console.error("Service Sync Error:", error);
        return NextResponse.json({ error: "Failed to sync services", details: error.message }, { status: 500 });
    }
}
