
import { NextResponse } from "next/server";

export async function GET(request) {
    const country = request.headers.get("x-vercel-ip-country") || "US";
    return NextResponse.json({ country });
}