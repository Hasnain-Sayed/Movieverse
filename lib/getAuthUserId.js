import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

/**
 * Returns the logged-in user's id (string) or null.
 * 1. Verifies accessToken.
 * 2. If missing/expired, falls back to refreshToken and issues a new accessToken
 *    (same logic as /api/auth/checkCookies).
 */
export async function getAuthUserId() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
      return String(decoded._id);
    } catch (error) {
      // expired/invalid -> try refresh token below
    }
  }

  if (!refreshToken) return null;

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    await connectDB();
    const user = await User.findById(decoded._id).select("_id");
    if (!user) return null;

    const newAccessToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    cookieStore.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60,
      path: "/",
    });

    return String(user._id);
  } catch (error) {
    return null;
  }
}