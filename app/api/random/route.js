import { NextResponse } from "next/server";

export async function GET() {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const mediaType = Math.random() > 0.5 ? "movie" : "tv";

    // random page 1-100 ke beech
    const randomPage = Math.floor(Math.random() * 100) + 1;

    const res = await fetch(
        `https://api.themoviedb.org/3/discover/${mediaType}?api_key=${apiKey}&sort_by=popularity.desc&page=${randomPage}`,
        { cache: "no-store" }
    );
    const data = await res.json();

    const results = data.results?.filter(item => item.poster_path);
    if (!results?.length) return NextResponse.json({ error: "No results" }, { status: 404 });

    // results mein se random ek
    const random = results[Math.floor(Math.random() * results.length)];

    return NextResponse.json({
        id: random.id,
        title: random.title || random.name,
        poster: `https://image.tmdb.org/t/p/w500${random.poster_path}`,
        rating: random.vote_average?.toFixed(1),
        media_type: mediaType,
    });
}