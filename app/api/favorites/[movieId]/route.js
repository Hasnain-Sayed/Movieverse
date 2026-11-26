import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Favorite from "@/models/Favorite";
import { getAuthUserId } from "@/lib/getAuthUserId";

// DELETE /api/favorites/:movieId?mediaType=movie|tv
export async function DELETE(request, { params }) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { movieId } = await params;
    const id = Number(movieId);
    const mediaType = new URL(request.url).searchParams.get("mediaType") || "movie";

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ success: false, message: "Invalid movieId" }, { status: 400 });
    }
    if (!["movie", "tv"].includes(mediaType)) {
      return NextResponse.json({ success: false, message: "Invalid mediaType" }, { status: 400 });
    }

    await connectDB();
    // filter includes userId, so one user can never delete another user's favorite
    await Favorite.deleteOne({ userId, mediaType, movieId: id });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE favorites error:", error);
    return NextResponse.json({ success: false, message: "Something went wrong." }, { status: 500 });
  }
}