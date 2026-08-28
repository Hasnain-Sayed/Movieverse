import TopRatedMovies from "../carousels/TopRatedMovies";
//had to use this method because we can use "use client" directive on a Server side component

//fetching top rated movies from TMDB
export default async function FetchTopRatedMovies() {
    //get the api key
    const apiKEY = process.env.NEXT_PUBLIC_TMDB_API_KEY

    //make the api request
    const res = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKEY}`);

    //return empty array if the request fails
    if (!res.ok) return []

    //convert the resposne to json and display only 14 movies
    const data = await res.json()
    const movies = data.results ? data.results.slice(0,14) : [];

    //passing the movie list to top rated movie component

    return <TopRatedMovies movies={movies} />

}