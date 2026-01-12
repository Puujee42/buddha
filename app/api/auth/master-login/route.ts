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

        // 2. Lookup User by Email
        const client = await clerkClient();
        const userList = await client.users.getUserList({ emailAddress: [email], limit: 1 });

        if (userList.data.length === 0) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
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
