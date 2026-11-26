import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Favorite from "@/models/Favorite";
import { getAuthUserId } from "@/lib/getAuthUserId";

// GET /api/favorites -> only the logged-in user's favorites
export async function GET() {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // ONE-TIME MIGRATION: run once, then DELETE these 2 lines
    // await Favorite.syncIndexes();
    // await Favorite.updateMany({ mediaType: { $exists: false } }, { $set: { mediaType: "movie" } });

    const favorites = await Favorite.find({ userId }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, favorites }, { status: 200 });
  } catch (error) {
    console.error("GET favorites error:", error);
    return NextResponse.json({ success: false, message: "Something went wrong." }, { status: 500 });
  }
}

// POST /api/favorites  body: { movieId, mediaType: "movie" | "tv" }
export async function POST(request) {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const movieId = Number(body?.movieId);
    const mediaType = body?.mediaType || "movie";

    if (!Number.isInteger(movieId) || movieId <= 0) {
      return NextResponse.json({ success: false, message: "Invalid movieId" }, { status: 400 });
    }
    if (!["movie", "tv"].includes(mediaType)) {
      return NextResponse.json({ success: false, message: "Invalid mediaType" }, { status: 400 });
    }

    // Fetch trusted data from TMDB on the server
    const tmdbRes = await fetch(
      `https://api.themoviedb.org/3/${mediaType}/${movieId}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`,
      { cache: "no-store" }
    );

    if (tmdbRes.status === 404) {
      return NextResponse.json({ success: false, message: "Not found on TMDB" }, { status: 404 });
    }
    if (!tmdbRes.ok) {
      return NextResponse.json({ success: false, message: "TMDB request failed" }, { status: 502 });
    }

    const m = await tmdbRes.json();
    const isTv = mediaType === "tv";

    const mediaData = {
      title: isTv ? m.name : m.title,
      posterPath: m.poster_path ?? null,
      voteAverage: m.vote_average ?? 0,
      releaseDate: (isTv ? m.first_air_date : m.release_date) ?? "",
      backdropPath: m.backdrop_path ?? null,
      overview: m.overview ?? "",
      tagline: m.tagline ?? "",
      genres: (m.genres ?? []).map((g) => g.name),
      runtime: isTv ? (m.episode_run_time?.[0] ?? 0) : (m.runtime ?? 0),
      numberOfSeasons: isTv ? (m.number_of_seasons ?? 0) : 0,
      originalLanguage: m.original_language ?? "",
    };

    await connectDB();

    // upsert = double click / repeat request safe
    let favorite;
    try {
      favorite = await Favorite.findOneAndUpdate(
        { userId, mediaType, movieId },
        { $set: mediaData, $setOnInsert: { userId, mediaType, movieId } },
        { upsert: true, new: true }
      ).lean();
    } catch (err) {
      if (err.code === 11000) {
        favorite = await Favorite.findOne({ userId, mediaType, movieId }).lean();
      } else {
        throw err;
      }
    }

    return NextResponse.json({ success: true, favorite }, { status: 201 });
  } catch (error) {
    console.error("POST favorites error:", error);
    return NextResponse.json({ success: false, message: "Something went wrong." }, { status: 500 });
  }
}