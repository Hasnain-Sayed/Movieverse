import { connectDB } from "@/lib/db";
import { sendResetEmail } from "@/lib/emails/mailer";
import OtpToken from "@/models/OtpToken";
import User from "@/models/user";
import { NextResponse } from "next/server";
import randomOtp from "random-otp-generator";


export async function POST(request) {
    try {
        const { email } = await request.json()
        if (!email) return NextResponse.json({ success: false, message: "Please enter your email." }, { status: 400 })
        await connectDB()
        const userCheck = await User.findOne({ email: email })
        if (!userCheck) return NextResponse.json({ success: false, message: "User Not Found, Try another mail or create an account" }, { status: 404 })


        if (userCheck) {
            const existing = await OtpToken.findOne({ email })
            if (existing && new Date() < existing.resendAt) {
                const secondsLeft = Math.ceil((existing.resendAt - new Date()) / 1000);
                return NextResponse.json({
                    success: false,
                    message: `Please wait ${secondsLeft} seconds before requesting a new code.`
                }, { status: 429 });
            }

            const otp = randomOtp(5)
            const now = new Date();
            const expiresAt = new Date(now.getTime() + 15 * 60 * 1000);
            const resendAt = new Date(now.getTime() + 45 * 1000);

            //deleting existing OTP for this email if found
            await OtpToken.deleteMany({ email });

            //save new OTP 
            await OtpToken.create({ email, otp, expiresAt, resendAt });

            // sending email after saving the token for validation
            const res = await sendResetEmail({ email, otp })
            return NextResponse.json({ success: true, message: "Sending over the digits. Check your Email." }, { status: 200 })
        }

    } catch (error) {
        console.error('Forgot password error,', error)
        return NextResponse.json({ success: false, message: "Something went wrong. Please try again." }, { status: 500 })
    }

}
