import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import {sendWelcomeEmail} from "@/lib/emails/mailer"


export async function POST(request) {
    try {
        const body = await request.json()
        const { name, email, age, password,confirmPassword } = body
        if (!name) return NextResponse.json({ message: "Enter Your Name" }, { status: 400 })
        if (!email) return NextResponse.json({ message: "Enter Your Email" }, { status: 400 })
        if (!age) return NextResponse.json({ message: "Enter Your Age" }, { status: 400 })
        if (!password) return NextResponse.json({ message: "Enter Your Password" }, { status: 400 })
        if (!confirmPassword) return NextResponse.json({ message: "Enter Your Confirmed Password" }, { status: 400 })
        if (password.length < 8 || confirmPassword.length < 8) return NextResponse.json({ message: "Password should be atleast 8 characters" }, { status: 400 })
        
        if(!(password === confirmPassword)) return NextResponse.json({success:false, message:"Passwords must match!"} ,{ status: 400 })

        await connectDB()
        const userCheck = await User.findOne({ email: email })
        if (userCheck) return NextResponse.json({success:false, message: "Email is already Registered!" }, { status: 400 })
        const hashedPassword = await bcrypt.hash(password, 10)
        const hashedConfirmPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({ name: name, email: email,age:age, password: hashedPassword,confirmPassword:hashedConfirmPassword })
        const res = await sendWelcomeEmail({email,name})
        return NextResponse.json({success:true, message: "User Created Successfully" }, { status: 201 })

    } catch (error) {
        console.error("Signup error, ", error)
        return NextResponse.json({success:false, message: "Invalid credentials" }, { status: 400 })
    }


}