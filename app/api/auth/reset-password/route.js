import { connectDB } from "@/lib/db";
import OtpToken from "@/models/OtpToken";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"
import User from "@/models/user";

export async function POST(request) {
    try {
        const body = await request.json()
        const { email, otp, newPassword } = body

        if (!email || !otp || !newPassword) return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        await connectDB()
        const record = await OtpToken.findOne({ email });

        if (!record) return NextResponse.json({ message: "No reset code found" }, { status: 400 });
        if (new Date() > record.expiresAt) {
            await OtpToken.deleteOne({ email });
            return NextResponse.json({ message: "Code has expired" }, { status: 400 });
        }
        if (record.otp !== otp) {
            return NextResponse.json({ success: false, message: "Incorrect code" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await User.findOneAndUpdate({ email }, { password: hashedPassword });

        await OtpToken.deleteOne({ email });

        return NextResponse.json({ message: "Password reset successful" }, { status: 200 });


    } catch (error) {
        console.error('Reset password error, ', error)
        return NextResponse.json({ success: false, message: "Something went wrong. Please try again." }, { status: 500 })
    }
}