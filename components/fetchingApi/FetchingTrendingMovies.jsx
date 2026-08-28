import TrendingMovies from "../carousels/TrendingMovies";
//had to use this method because we can use "use client" directive on a Server side component

//fetching trending movies of the week from TMDB
export default async function FetchTrendingMovies() {
    //get the api key
    const apiKEY = process.env.NEXT_PUBLIC_TMDB_API_KEY

    //make the api request
    const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKEY}`);

    //return empty array if the request fails
    if (!res.ok) return []

    //convert the resposne to json and display only 14 movie from index 3
    const data = await res.json()
    const movies = data.results ? data.results.slice(3,17) : [];

    //passing the movie list to trending movie component

    return <TrendingMovies movies={movies} />

}