import HeroSection from "../components/hero/HeroSection";
import FetchingTrendingMovies from "@/components/fetchingApi/FetchingTrendingMovies"
import FetchingTopRatedMovies from "@/components/fetchingApi/FetchingTopRatedMovies";
import FetchingTrendingTvSeries from "@/components/fetchingApi/FetchingTrendingTvSeries";
import FetchingTopRatedTvSeries from "@/components/fetchingApi/FetchingTopRatedTvSeries";



export default function Home() {
  return <div className=" min-h-screen text-white">
    <HeroSection/>
    <FetchingTrendingMovies/>
    <FetchingTopRatedMovies />
    <FetchingTrendingTvSeries />
    <FetchingTopRatedTvSeries />

    </div>;
}
