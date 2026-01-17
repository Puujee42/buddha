import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ message: "Missing credentials" }, { status: 400 });
        }

        // 1. Verify Master Password
        if (password !== "Gevabal") {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        // 2. Lookup User by Email or Phone
        const client = await clerkClient();
        const isEmail = email.includes("@");

        let userList;
        let debugIdentifier = email;

        if (isEmail) {
            userList = await client.users.getUserList({ emailAddress: [email], limit: 1 });
        } else {
            // Handle phone number
            // If it's a Mongolian number (8 digits), add +976 prefix
            // Otherwise, ensure it has a + prefix
            let phone = email.replace(/\s/g, '');
            if (/^\d{8}$/.test(phone)) {
                phone = `+976${phone}`;
            } else if (!phone.startsWith("+")) {
                phone = `+${phone}`;
            }

            debugIdentifier = phone;
            userList = await client.users.getUserList({ phoneNumber: [phone], limit: 1 });

            // FALLBACK: If not found by verified phone, search in metadata (unsafeMetadata.phone)
            // This is needed because some users store phone in metadata without verifying it as an identifier.
            if (userList.data.length === 0) {
                // We search by iterating recent users. Note: This is not efficient for millions of users, 
                // but acceptable for this specific "master login" use case / smaller user base.
                const allUsers = await client.users.getUserList({ limit: 100 });

                // Check both with and without country code
                const rawPhone = email.replace(/\s/g, ''); // Original input cleaned
                const formattedPhone = phone; // +976...

                const foundUser = allUsers.data.find(u =>
                    (u.unsafeMetadata?.phone as string)?.includes(rawPhone) ||
                    (u.publicMetadata?.phone as string)?.includes(rawPhone) ||
                    (u.unsafeMetadata?.phone as string) === formattedPhone
                );

                if (foundUser) {
                    userList = { data: [foundUser], totalCount: 1 };
                }
            }
        }

        if (userList.data.length === 0) {
            return NextResponse.json({ message: `User not found. Searched: ${debugIdentifier}` }, { status: 404 });
        }

        const user = userList.data[0];

        // 3. Generate Sign-In Token (valid for 30 days by default, but intended for immediate use)
        // This allows the client to sign in as this user immediately.
        const signInToken = await client.signInTokens.createSignInToken({
            userId: user.id,
            expiresInSeconds: 60
        });

        return NextResponse.json({ token: signInToken.token, status: "success" });

    } catch (error: any) {
        console.error("Master Login Error:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}
