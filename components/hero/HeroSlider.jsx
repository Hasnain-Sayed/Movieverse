"use client"

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/effect-fade"
import Link  from "next/link";
import useSWR  from "swr";
import TrailerModal from "../TrailerModal.jsx";
import { useAuth } from "@/context/AuthContext.jsx"

//fetch data from the url and return it as json and throw error if the request fails
const fetcher = (url) => 
    fetch(url).then((res) => {
        if (!res.ok) throw new Error("Failed to fetch trailer")
        return res.json();
    });


export default function HeroSlider({ movies }) {
    const [currentSlide, setCurrentSlide] = useState(0)//state to track current slide index
    const [swiperInstance, setSwiperInstance] = useState(null) // store swiper instance for controlling slide navigation
    const [isModalOpen, setIsModalOpen] = useState(false)// state to show or hide trailer modal
    const [selectedMedia, setSelectedMedia] = useState(null)// store the selected media to display its trailer

    const {user} = useAuth()
    const isAdult = user ? user.age >= 18 : false

    //create a function to get the media title
    const getMediaTitle = (media) => {
        return media.media_type === 'movie' ? media.title || "untitle" : media.name || "untitle"
    }

    //create a function to get the movie genres
    const getGenres = (media) => {
        if (media.media_type === 'movie' && media.genres && media.genres.length > 0) {
            return media.genres.map((g) => g.name).join(", ");
        }
        return "";
    };

    //create a function to format movie runtime into hours and minutes
    const formatDurtion = (media) => {
        if (media.media_type === "movie" && media.runtime) {
            const h = Math.floor(media.runtime / 60)
            const m = media.runtime % 60
            return `${h}h ${m}m`
        }
        return ""
    }

    //handle navigation button clicks to switch to specified slide and update current slide state
    const handleButtonClick = (index) => {
        if (swiperInstance) {
            swiperInstance.slideToLoop(index)
            setCurrentSlide(index)
        }
    };

    // fecth trailer videos for the selected media using SWR
    const { data: trailerData, error,isLoading } = useSWR(
        selectedMedia
            ? `https://api.themoviedb.org/3/${selectedMedia.media_type}/${selectedMedia.id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&include_adult=${isAdult}`
            : null,
        fetcher
    );

    

    if (error) {
        console.error("Trailer fetch failed:", error)
    }

    //find the first youtube trailer from the fetched videos
    const trailer = trailerData?.results?.find(
        (video) => video.site === 'YouTube' && ['Trailer'].includes(video.type)
    );

    // youtube embed URL for the trailer if it founds
    const trailerURL = trailer ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1` : null;

    // open the trailer modal and set the selected media 
    const openModal = (media) => {
     
        if (!media?.id) return;
        setSelectedMedia(media)
        setIsModalOpen(true)
    }
    
    // close the trailer modal and clear the selected media
    const closeModal = () => {
        
        setIsModalOpen(false)
        setSelectedMedia(null)
    }

    return (

        <section className="relative min-h-90 sm:min-h-120 md:min-h-180 lg:min-h-screen w-full ">
            <Swiper modules={[Autoplay, Pagination, EffectFade]}
                effect="fade"
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                loop={movies.length > 1}
                onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
                onSwiper={(swiper) => setSwiperInstance(swiper)}
                className="w-full h-full"
            >

                {movies.map((media) => (
                    <SwiperSlide key={media.id}>
                        <div className="relative w-full h-90 sm:h-120 md:h-180 lg:h-screen ">
                            <div className="absolute inset-0 bg-cover bg-center"
                                style={{
                                    backgroundImage: `url(https://image.tmdb.org/t/p/w1280${media.backdrop_path || "placeholder.jpg"})`,
                                }}
                            ></div>
                            <div className="absolute inset-0 bg-linear-to-b from-black/40 to-black/80"> </div>
                            <div className="absolute inset-0 flex items-center sm:items-end p-4 sm:p-8 md:p-20 text-white max-w-xs sm:max-w-md md:max-w-2xl">
                                <div>
                                    <Link href={`/details?id=${media.id}&media_type=${media.media_type}`} >
                                    <h1 className="text-2xl md:text-5xl font-bold leading-tight sm:leading-snug">{getMediaTitle(media)}</h1>
                                    </Link>
                                    <p className="text-sm sm:text-sm md:text-lg mt-0.5 sm:mt-2 text-yellow-400 font-semibold sm:leading-5">{getGenres(media)}</p>
                                    <p className="text-sm sm:text-sm md:text-lg mt-5 line-clamp-5 hidden sm:block sm:leading-5">{media.overview || "No Description Available"}</p>
                                    <p className="text-sm sm:text-sm md:text-lg mt-5 sm:leading-5">
                                        <span className="mr-4">
                                            ⭐{(media.vote_average).toFixed(1)} / 10
                                        </span>
                                        {media.media_type === "movie" && (
                                            <>
                                            <span className="mr-4">|</span>
                                            <span> {formatDurtion(media)}</span>
                                            </>
                                        )}
                                    </p>
                                    <button 
                                    onClick={() => openModal(media)}
                                    disabled={!media.id}
                                    className={`mt-5 sm:mt-8 inline-block bg-yellow-400 text-black px-4 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-lg font-semibold hover:bg-yellow-500 transition text-sm sm:text-base md:text:base ${!media.id ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} `}>Watch Trailer</button>
                                </div>
                            </div>


                        </div>
                    </SwiperSlide>
                ))}

            </Swiper>

            {/* navigation buttons */}
            {movies.length > 1 && (
                <div className="absolute right-4 sm:right-8 md:right-12 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-1">
                    {movies.map((_,index) => (
                        <button key={index} className={`h-4 w-4 sm:h-4 sm:w-4 md:h-5 md:w-5 rounded-full border-2 transition-colors ${currentSlide === index ? "bg-yellow-400 border-yellow-300" : "bg-transparent border-white"}`}
                        onClick={()=> handleButtonClick(index)}
                        aria-label={`slide ${index + 1}`}
                        ></button>
                    ))}
                </div>
            )}

            <TrailerModal 
            isOpen={isModalOpen} 
            onClose={closeModal} 
            trailerUrl={trailerURL}
            title={selectedMedia ? getMediaTitle(selectedMedia) : 'Trailer'}
            
            />


        </section>

    )

}