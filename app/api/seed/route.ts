import { NextResponse } from "next/server";
import { seedDatabase } from "@/database/seed";

export async function GET() {
  try {
    const result = await seedDatabase();
    return NextResponse.json({
      message: "The sanctuary has been seeded successfully.",
      ...result
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to seed the sanctuary.", error: error.message },
      { status: 500 }
    );
  }
}
