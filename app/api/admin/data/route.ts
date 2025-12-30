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

    // 3. Fetch All Services
    const services = await db.collection("services").find({}).toArray();

    // 4. Calculate Stats
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
      services,
      stats
    });

  } catch (error) {
    return NextResponse.json({ message: "Admin Data Error" }, { status: 500 });
  }
}