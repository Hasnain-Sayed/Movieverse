import jwt from "jsonwebtoken"
import { NextResponse } from "next/server";

export function generateAccessAndRefreshToken(user){
    try {
        const accessToken = jwt.sign(
        {
            _id:user._id,
            name:user.name,
            email:user.email,
            age:user.age,
            role:user.role,
        },
        process.env.JWT_ACCESS_SECRET,
        {expiresIn:"15m"}
    );

    const refreshToken = jwt.sign(
        {
            _id:user._id,
            name:user.name,
            email:user.email,
            age:user.age,
            role:user.role,
        },
        process.env.JWT_REFRESH_SECRET,
        {expiresIn:"1d"}
    );

    const tokens = {accessToken,refreshToken}
    return tokens

    } catch (error) {
        NextResponse.json({success : false, message : "Something went wrong while generating access and refresh tokens"},{status : 500})
    }

}

