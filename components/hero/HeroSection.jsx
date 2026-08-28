// fetch the treding movies from TMDB including extra details for each movie

import HeroSlider from "../hero/HeroSlider"

async function fetchTrendingMovies() {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY

    //fecthing past week trending movies
    const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`)

    if (!res.ok) return []

    const data = await res.json()
    const movies = data.results ? data.results.slice(0, 3) : []
    // extra details
    const detailedMovies = await Promise.all(
        movies.map(async (movie) => {
            if (movie.media_type === 'movie') {
                const detailRes = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`);

                if (detailRes.ok) {
                    const detailData = await detailRes.json()
                    
                    return {
                        ...movie,
                        genres: detailData.genres,
                        runtime: detailData.runtime
                    }
                }
            }

            //if there is no extra data return the movie as it is
            return movie


        })
    );
    //return final list of movies with extra information
    return detailedMovies
}


export default async function HeroSection() {
    const movies = await fetchTrendingMovies()

    return <HeroSlider movies={movies} />

}