"use client"

import Image from "next/image";
import Link from "next/link";
import useSWR from "swr"
import TrailerModal from "./TrailerModal";
import { useState } from "react";
import { FaYoutube } from "react-icons/fa"



//helper function to fetch json data from url (used with SWR to automaticallly fetch and cache data)
const fetcher = async (url) => {
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `${response.status}: ${data.status_message || "TMDB request failed"}`
    );
  }

  return data;
};

export default function Card({ media,swiperRef }) {

    // destructure media properties with fallback values
    const { id, poster_path: posterPath, title, name, vote_average: voteAverage, media_type: mediaType = "movie"
    } = media || {};

    //fallback title if name or title are missing
    const displayTitle = title || name || "Untitled";

    const [isModalOpen, setIsModalOpen] = useState(false)


    //fetch trailer videos using SWR if media id is available
    const { data: trailerData, error } = useSWR(
        id ? `https://api.themoviedb.org/3/${mediaType}/${id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-us` : null,
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

    // open the trailer modal 
    const openModal = () => {
        setIsModalOpen(true)
        swiperRef?.current?.autoplay?.stop()
    }


    // close the trailer modal
    const closeModal = () => {
        setIsModalOpen(false)
        swiperRef?.current?.autoplay?.start()
    }


    return (
        <div className="flex-none bg-[#18181b] rounded-lg overflow-hidden shadow-lg snap-start">
            <Link href={`/details?id=${id}&media_type=${mediaType}`}>
                <div className="relative aspect-2/3 group cursor-pointer">
                    <Image src={posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : "/default_poster.jpg"}
                        alt=''
                        fill
                        className="object-cover rounded-t-lg group-hover:brightness-95 transition-all"
                        sizes="33vw"
                        quality={75}
                        loading="lazy"
                    />

                </div>
            </Link>
            <div className="px-1 py-1 sm:px-3 sm:py-4 flex flex-col gap-1 sm:gap-2">
                <p className="text-xs sm:text-sm text-yellow-400 m-2">
                    ⭐ {voteAverage?.toFixed(1) || "N/A"}
                </p>
                <Link href={`/details?id=${id}&media_type=${mediaType}`}>
                    <h3 className="text-xs sm:text-sm md:text-lg my-1 mx-2 font-semibold text-white line-clamp-2 h-12 sm:h-14 cursor-pointer hover:underline">{displayTitle}</h3>
                </Link>
                <button 
                onClick={openModal}
                disabled={!trailerURL}
                className={`flex items-center justify-center gap-1 w-full py-2 bg-[#18181b] text-white font-bold border border-gray-600 rounded-3xl hover:bg-[#252525] transition-colors text-sm sm:text-base ${!trailerURL ? 'opacity-50 cursor-not-allowed ' : 'cursor-pointer'}`}>
                
                    <FaYoutube className="text-red-600 hover:text-red-500 transition-colors" size={24} />
                        
                    Trailer

                </button>
            </div>

            <TrailerModal isOpen={isModalOpen} onClose={closeModal} trailerUrl={trailerURL} title={displayTitle}/>

        </div>
    )


}