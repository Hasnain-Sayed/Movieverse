import { cookies } from "next/headers"
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/user";

export async function GET(request) {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get("accessToken")?.value;
        const refreshToken = cookieStore.get("refreshToken")?.value;

        if (!accessToken && !refreshToken) { // return if no token found
            return NextResponse.json({ success: false }, { status: 401 });
        }
        if (accessToken) {
            try {
                const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
                await connectDB();
                const user = await User.findById(decoded._id).select("name email age");
                if (user) return NextResponse.json({ success: true, user }, { status: 200 });
            } catch (error) {
                console.log("Access token error:", error.message)
            }
        }

        if (!refreshToken) return NextResponse.json({ success: false }, { status: 401 });

        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            await connectDB()
            const user = await User.findById(decoded._id).select("name email age");
            if (!user) return NextResponse.json({ success: false }, { status: 401 });

            //generate a new accessToken
            const newAccessToken = jwt.sign(
                { userId: user._id },
                process.env.JWT_ACCESS_SECRET,
                { expiresIn: "15m" }
            )

            //setting new access token in cookies 
            cookieStore.set("accessToken", newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 15 * 60,
                path: "/",
            });

            return NextResponse.json({ success: true, user }, { status: 200 });
        } catch (error) {
            console.log("Refresh token error:", error.message) 
            return NextResponse.json({ success: false }, { status: 401 });
        }



    } catch (error) {
        return NextResponse.json({ success: false }, { status: 401 });
    }
} 