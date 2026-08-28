import TrendingTvSeries from "../carousels/TrendingTvSeries";
//had to use this method because we can use "use client" directive on a Server side component

//fetching trending tv series of the week from TMDB
export default async function FetchingTrendingTvSeries() {
    //get the api key
    const apiKEY = process.env.NEXT_PUBLIC_TMDB_API_KEY

    //make the api request
    const res = await fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKEY}`);

    //return empty array if the request fails
    if (!res.ok) return []

    //convert the resposne to json and display only 14 series 
    const data = await res.json()
    const series = data.results ? data.results.slice(0,14) : [];

    //passing the tv series list to trending tv series component

    return <TrendingTvSeries series={series} />

}