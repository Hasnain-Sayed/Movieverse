import { NextResponse } from "next/server";
import OtpToken from "@/models/OtpToken";
import { connectDB } from "@/lib/db";

export async function POST(request) {

    try {
        const body = await request.json()
        const { email, otp } = body
        if (!email || !otp) return NextResponse.json({  success: false, message: "Email and code are required" }, { status: 400 });
        await connectDB();

        const record = await OtpToken.findOne({ email })
        if (!record) return NextResponse.json({  success: false, message: "No reset code found, request a new one" }, { status: 400 });

        //check expiry
        if (new Date() > record.expiresAt) {
            await OtpToken.deleteOne({ email });
            return NextResponse.json({  success: false, message: "Code has expired, request a new one" }, { status: 400 });
        }

        if (record.otp !== otp) {
            return NextResponse.json({ success: false, message: "Incorrect code" }, { status: 400 });
        }

        return NextResponse.json({ success: true, message: "Code verified" }, { status: 200 });
    } catch (error) {
        console.error('verify otp error,', error)
        return NextResponse.json({ success: false, message: "Something went wrong. Please try again." }, { status: 500 })
    }

}