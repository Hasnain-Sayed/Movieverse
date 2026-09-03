"use client"

import TrailerModal from "@/components/TrailerModal";
import Card from "@/components/Card";
import Image from "next/image";
import useSWR from "swr"
import { useSearchParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import 'swiper/css';
import { Undo2 } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "boneyard-js/react";



// create a helper function for useSWR
const fetcher = (url) =>
    fetch(url).then((res) => {
        if (!res.ok) throw new Error("Failed to Fetch");
        return res.json()
    });


export default function DetailsPage() {
    const swiperRef = useRef(null)
    //get url parameters(id and media_type)
    const searchParams = useSearchParams()
    const id = searchParams.get('id')
    const mediaType = searchParams.get("media_type") || "movie"
    const router = useRouter()//to allow go back button to work

    //control trailer modal visibilty
    const [isModalOpen, setIsModalOpen] = useState(false)


    //get the api URL
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY

    //fetch main media details with credits
    const { data: media } = useSWR(
        id ? `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${apiKey}&language=en-US&append_to_response=credits` : null,
        fetcher
    );

    // fetch media trailer videos
    const { data: videos } = useSWR(
        id ? `https://api.themoviedb.org/3/${mediaType}/${id}/videos?api_key=${apiKey}&language=en-US` : null, fetcher
    );

    // fetch the recommendations movies
    const { data: recommendations } = useSWR(
        id ? `https://api.themoviedb.org/3/${mediaType}/${id}/recommendations?api_key=${apiKey}&language=en-US` : null,
        fetcher
    );

    //find the first youtube trailer
    const trailer = videos?.results?.find((v) => v.site === "YouTube" && v.type === "Trailer")
    const trailerUrl = trailer ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1` : null;

    //modal open/close handlers
    const openModal = () => trailerUrl && setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)

    //create helper functions for displaying media info
    const getTitle = () => (mediaType === "movie" ? media?.title : media?.name);
    const getDate = () => mediaType === "movie" ? media?.release_date : media?.first_air_date;
    const getGenres = () => media?.genres?.map((g) => g.name).join(", ") || "N/A";
    const getRating = () => media?.vote_average?.toFixed(1) || "N/A";
    const getRuntime = () => {
        if (mediaType === "movie") {
            return media?.runtime ? `${Math.floor(media.runtime / 60)}h ${media.runtime % 60}m` : "N/A";
        }
        return media?.number_of_seasons ? `${media.number_of_seasons} ${media.number_of_seasons > 1 ? 'Seasons' : 'Season'}` : "N/A";
    }
    const getDirector = () => {
        if (mediaType === "movie") {
            return (
                media?.credits?.crew?.find((p) => p.job === "Director")?.name || "N/A"
            );
        }
        return media?.created_by?.map((p) => p.name).join(", ") || "N/A"
    }

    const getCast = () => media?.credits?.cast?.slice(0, 10) || []

    //show loading message while data is being fetched
    if (!media) {
        return (
            <Skeleton name="movie-details" loading>
                <div className="bg-black text-white min-h-screen p-6">
                    <div className="mx-auto max-w-6xl space-y-6">
                        <div className="h-60 rounded-lg bg-[#18181b]" />
                        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
                            <div className="aspect-2/3 rounded-lg bg-[#18181b]" />
                            <div className="space-y-4">
                                <div className="h-8 w-2/3 rounded bg-[#18181b]" />
                                <div className="h-5 w-1/3 rounded bg-[#18181b]" />
                                <div className="h-24 w-full rounded bg-[#18181b]" />
                                <div className="h-5 w-1/2 rounded bg-[#18181b]" />
                            </div>
                        </div>
                    </div>
                </div>
            </Skeleton>
        )
    }

    const goBack = () => router.back()

    return (
        <div className="bg-black text-white min-h-screen ">
            <div className="relative">
                {/* backdrop image */}
                <section className="relative h-60 sm:h-80 md:h-120 w-full bg-center z-0"
                    style={{
                        backgroundImage: media.backdrop_path
                            ? `url(https://image.tmdb.org/t/p/w1280${media.backdrop_path})`
                            : "url(/file.svg)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <div className="absolute inset-0 bg-linear-to-b from-black/40 to-black/80"></div>
                </section>
                <motion.div
                    className="absolute left-[5%] top-[70%] sm:left-[10%] sm:top-[70%] md:top-[50%]  lg:top-[55%] xl:left-[5%] xl:top-[75%] z-30"
                    initial="hidden"
                    whileHover="visible"
                >
                    <button
                        onClick={goBack}
                        aria-label="Go Back"
                        className="relative z-30 rounded-xl bg-yellow-400 px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 lg:px-5 lg:py-2 text-black hover:bg-yellow-500"
                    >
                        <Undo2 />
                    </button>

                    <motion.span
                        variants={{
                            hidden: { y: -8, opacity: 0 },
                            visible: { y: 8, opacity: 1 },
                        }}
                        transition={{ duration: 0.25 }}
                        className="pointer-events-none absolute left-1/2 top-full -translate-x-1/2 whitespace-nowrap rounded-md bg-yellow-400 px-3 py-1   text-xs md:text-sm font-medium text-black"
                    >
                        Go Back
                    </motion.span>
                </motion.div>
            </div>

            {/* main details section */}
            <section className="container mx-auto px-6 sm:px-12 lg:px-40 rounded-b-lg z-10 relative -mt-20 sm:-mt-35 md:-mt-45">
                <div className="bg-transparent flex flex-col md:flex-row gap-6 sm:gap-8 pt-4 pb-6 sm:pt-6 sm:pb-8 rounded-b-lg">
                    {/* poster and trailer button */}
                    <div className="flex-none w-full max-w-60 sm:max-w-75 mx-auto md:mx-0 flex flex-col items-center">
                        <Image src={media.poster_path ? `https://image.tmdb.org/t/p/w500${media.poster_path}` : "/default_poster.jpg"}
                            alt=""
                            width={300}
                            height={450}
                            className="object-cover rounded-lg w-full"
                            quality={75}
                        />
                        <button onClick={openModal}
                            disabled={!trailerUrl}
                            className={`mt-4 w-full bg-yellow-400 text-black px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium text-sm sm:text-base hover:bg-amber-400 transition-colors ${!trailerUrl ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
                            Watch Trailer
                        </button>
                    </div>


                    {/* text info */}
                    <div className="flex-1">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">
                            {getTitle()}
                        </h2>
                        <div className="flex items-center gap-3 sm:gap-4 mt-2">
                            <p className="text-xs sm:text-sm md:text-base text-yellow-400">{getGenres()}</p>
                            <p className="text-xs sm:text-sm md:text-base">⭐ {getRating()}
                            </p>
                        </div>
                        <p className="text-sm sm:text-base md:text-lg mt-4 sm:mt-6 text-gray-300">{media.overview || "No description available"}</p>
                        <div className="mt-4 sm:mt-6 space-y-1 sm:space-y-2">
                            <p className="text-xs sm:text-sm md:text-base">
                                <span className="font-medium">Duration: </span>
                                <span className="text-gray-300">{getRuntime()}</span>
                            </p>
                            <p className="text-xs sm:text-sm md:text-base">
                                <span className="font-medium">Release Date: </span>
                                <span className="text-gray-300">{getDate()}</span>
                            </p>
                            <p className="text-xs sm:text-sm md:text-base">
                                <span className="font-medium">{mediaType === "movie" ? "Director" : "Creator"} </span>
                                <span className="text-gray-300">{getDirector()}</span>
                            </p>
                        </div>

                        {/* cast section */}
                        <div className="mt-4 sm:mt-6">
                            <h3 className="text-base sm:text-lg md:text-xl font-semibold">Cast</h3>
                            <div className=" grid grid-cols-5 md:grid-cols-5 xl:grid-cols-10  gap-3 sm:gap-8 mt-3 sm:mt-4 pb-2">{getCast().map((actor, index) => (
                                <div key={index} className="flex-none flex flex-col items-center w-16 sm:w-20">
                                    <Image src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : "/default-profile.png"}
                                        alt=""
                                        width={64}
                                        height={64}
                                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full"
                                        quality={75}
                                    />
                                    <p className="text-xs sm:text-sm text-center mt-1 sm:mt-2 line-clamp-2">{actor.name}</p>
                                </div>
                            ))}</div>
                        </div>

                    </div>
                </div>
            </section>

            {/* recommendations movies section */}
            {recommendations?.results?.length > 0 && (
                <section className="container mx-auto px-6 sm:px-12 lg:px-20 xl:px-30 py-6 sm:py-8" >
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 sm:mb-4">Recommended {mediaType === "movie" ? "Movies" : "Series"}
                    </h2>
                    <Swiper modules={[Autoplay]}
                        onSwiper={(swiper) => { swiperRef.current = swiper }}
                        loop={true}
                        autoplay={{ delay: 0, disableOnInteraction: false, pauseOnMouseEnter: true }}
                        speed={4000}
                        spaceBetween={20}
                        breakpoints={{
                            0: { slidesPerView: 3 },
                            768: { slidesPerView: 3 },
                            1024: { slidesPerView: 4 },
                            1280: { slidesPerView: 5 },
                            1536: { slidesPerView: 6 }
                        }}
                    >
                        {recommendations.results.length > 0 ? (recommendations.results.slice(0, 9).map((item) =>
                            <SwiperSlide key={item.id}>
                                <Card media={{ ...item, media_type: mediaType }} swiperRef={swiperRef} />
                            </SwiperSlide>
                        )) : (
                            <p className="text-gray-400"> No Recommendations Found</p>
                        )}

                    </Swiper>

                </section>
            )}

            {/* trailer modal */}
            <TrailerModal
                isOpen={isModalOpen}
                onClose={closeModal}
                trailerUrl={trailerUrl}
                title={getTitle()}

            />

        </div>
    )


}