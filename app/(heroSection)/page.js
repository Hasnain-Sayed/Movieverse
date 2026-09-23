import HeroSection from "@/components/hero/HeroSection";
import FetchingTrendingMovies from "@/components/fetchingApi/FetchingTrendingMovies"
import FetchingTopRatedMovies from "@/components/fetchingApi/FetchingTopRatedMovies";
import FetchingTrendingTvSeries from "@/components/fetchingApi/FetchingTrendingTvSeries";
import FetchingTopRatedTvSeries from "@/components/fetchingApi/FetchingTopRatedTvSeries";
import RandomPicker from "@/components/hero/RandomMedia";



export default function Hero() {
  return <div className=" min-h-screen text-white">
    <HeroSection/>
    <FetchingTrendingMovies/>
    <FetchingTopRatedMovies />
    <FetchingTrendingTvSeries />
    <FetchingTopRatedTvSeries />
    <RandomPicker />
    </div>;
}
