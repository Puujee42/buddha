import { NextResponse } from "next/server";
import { connectToDatabase } from "@/database/db";
import { ObjectId } from "mongodb";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type Props = {
    params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, props: Props) {
    try {
        const { id } = await props.params;
        const { action } = await request.json();

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
        }

        const { db } = await connectToDatabase();

        // 1. Fetch the applicant data
        const applicant = await db.collection("users").findOne({ _id: new ObjectId(id) });

        if (!applicant) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if (action === 'approve') {
            // --- A. Database Updates ---

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

            // 2. Update User Role in 'users' collection and assign ALL services
            await db.collection("users").updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        role: "monk",
                        monkStatus: "approved",
                        services: serviceRefs, // Assign all services
                        updatedAt: new Date()
                    }
                }
            );

            // 3. Create or Update Public Profile in 'monks' collection
            // We map fields from the User document (filled during onboarding) to the Monk document
            const monkProfile = {
                userId: applicant._id,
                clerkId: applicant.clerkId,
                email: applicant.email, // Useful for booking notifications
                name: applicant.name || { mn: "", en: "" },
                title: applicant.title || { mn: "", en: "" },
                image: applicant.image || "",
                bio: applicant.bio || { mn: "", en: "" },
                specialties: applicant.specialties || [],
                services: applicant.services || [],
                yearsOfExperience: applicant.yearsOfExperience || 0,
                education: applicant.education || { mn: "", en: "" },
                philosophy: applicant.philosophy || { mn: "", en: "" },
                rating: 5.0, // Default starting rating
                isAvailable: true,
                isVerified: true,
                schedule: [], // Empty schedule to start
                blockedSlots: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            await db.collection("monks").updateOne(
                { userId: applicant._id },
                { $set: monkProfile },
                { upsert: true }
            );

            // --- B. Send Approval Email ---
            if (applicant.email) {
                try {
                    // Determine the name to greet them with (English or first available)
                    const greetingName = applicant.name?.en || applicant.name?.mn || "Guide";

                    await resend.emails.send({
                        from: "Nirvana Team <onboarding@resend.dev>", // Update this once you verify your domain
                        to: applicant.email,
                        subject: "Congratulations! Your Monk Application is Approved",
                        html: `
                        <div style="font-family: sans-serif; color: #451a03; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
                            <div style="text-align: center; margin-bottom: 20px;">
                                <h1 style="color: #D97706; margin: 0;">Welcome to the Sangha</h1>
                            </div>
                            
                            <p>Dear <strong>${greetingName}</strong>,</p>
                            
                            <p>We are honored to accept your application. Your profile has been reviewed and is now <strong>live</strong> on the Nirvana platform.</p>
                            
                            <p>You can now log in to your dashboard to:</p>
                            <ul>
                                <li>Set your weekly schedule</li>
                                <li>Manage your service offerings</li>
                                <li>Accept rituals and video calls</li>
                            </ul>
                            
                            <br/>
                            
                            <div style="text-align: center;">
                                <a href="${process.env.NEXT_PUBLIC_URL}/dashboard" style="background-color: #D97706; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                                    Go to Dashboard
                                </a>
                            </div>
                            
                            <br/><br/>
                            <hr style="border: 0; border-top: 1px solid #eee;" />
                            <p style="font-size: 12px; color: #888; text-align: center;">
                                Nirvana Spiritual Platform<br/>
                                <em>Connecting Wisdom & Technology</em>
                            </p>
                        </div>
                    `
                    });
                    console.log(`Approval email sent to ${applicant.email}`);
                } catch (emailError) {
                    console.error("Failed to send approval email:", emailError);
                    // Note: We do NOT throw error here, so the database update remains successful even if email fails
                }
            }

            return NextResponse.json({ message: "Approved and email sent" });

        } else if (action === 'reject') {
            // --- Handle Rejection ---

            // 1. Update User Status
            await db.collection("users").updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        monkStatus: "rejected",
                        updatedAt: new Date()
                    }
                }
            );

            // 2. Remove from 'monks' collection if it exists (cleanup)
            await db.collection("monks").deleteOne({ userId: new ObjectId(id) });

            // 3. Send Rejection Email
            if (applicant.email) {
                try {
                    const greetingName = applicant.name?.en || applicant.name?.mn || "Applicant";

                    await resend.emails.send({
                        from: "Nirvana Team <onboarding@resend.dev>",
                        to: applicant.email,
                        subject: "Update regarding your Monk Application",
                        html: `
                        <div style="font-family: sans-serif; color: #451a03; max-width: 600px; margin: 0 auto; padding: 20px;">
                            <p>Dear ${greetingName},</p>
                            <p>Thank you for your interest in joining Nirvana as a guide.</p>
                            <p>After careful review, we are unable to move forward with your application at this time. This may be due to incomplete profile information or current capacity limits.</p>
                            <p>You may update your profile information and apply again in the future.</p>
                            <br/>
                            <p style="font-size: 12px; color: #888;">Nirvana Spiritual Platform</p>
                        </div>
                    `
                    });
                    console.log(`Rejection email sent to ${applicant.email}`);
                } catch (emailError) {
                    console.error("Failed to send rejection email:", emailError);
                }
            }

            return NextResponse.json({ message: "Application rejected" });
        }

        return NextResponse.json({ message: "Invalid action" }, { status: 400 });

    } catch (error: any) {
        console.error("Admin PATCH Error:", error);
        return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
    }
}