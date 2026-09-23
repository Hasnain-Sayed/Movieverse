import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"
import { generateAccessAndRefreshToken } from "@/lib/server";

export async function POST(request) {
    try {
        const body = await request.json()
        const { email, password } = body
        if (!email || !password) return NextResponse.json({ success: false, message: "Fill all the fields." }, { status: 400 })
        await connectDB()
        const userCheck = await User.findOne({ email: email })
        if (!userCheck) return NextResponse.json({ success: false, message: "User Not Found, try different email" }, { status: 404 })

        const passwordCheck = await bcrypt.compare(password, userCheck.password)
        if (!passwordCheck) return NextResponse.json({ success: false, message: "Wrong Password, Try again!" }, { status: 400 })

        const { refreshToken, accessToken } = generateAccessAndRefreshToken(userCheck)

        const cookieStore = await cookies();

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" ? true : false,
            sameSite: "lax",
            path: "/",
        };

        cookieStore.set('refreshToken', refreshToken, {
            ...cookieOptions,
            maxAge: 60 * 60 * 24 // 1day
        })
        cookieStore.set('accessToken', accessToken, {
            ...cookieOptions,
            maxAge: 60 * 15 // 15 minutes
        })
        return NextResponse.json({ message: "Login Successful", success: true }, { status: 200 })


    } catch (error) {
        console.error('login error, ', error)
        return NextResponse.json({ success: false, message: "Something went wrong. Please try again." }, { status: 500 })

    }

}