"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Shuffle, Star, Tv, Film, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RandomPicker() {
    const [movie, setMovie] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const pickRandom = async () => {
        setIsLoading(true);
        setMovie(null);
        try {
            const res = await fetch("/api/random");
            const data = await res.json();
            setMovie(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="py-14 md:py-24 px-4 sm:px-8 md:px-20 bg-black text-white">
            {/* centered container */}
            <div className="max-w-2xl mx-auto flex flex-col items-center text-center">

                {/* heading */}
                <div className="mb-2 text-5xl md:text-6xl select-none">🎲</div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-yellow-400 mb-3">
                    Feeling Lucky?
                </h2>
                <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-10 max-w-sm">
                    Can't decide what to watch? Hit the button and let us surprise you.
                </p>

                {/* button */}
                <button
                    onClick={pickRandom}
                    disabled={isLoading}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-yellow-400 text-black text-base md:text-lg font-bold rounded-2xl hover:bg-yellow-500 transition-all hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-yellow-400/25 mb-10"
                >
                    <Shuffle size={22} className={isLoading ? "animate-spin" : ""} />
                    {isLoading ? "Finding something good..." : "Pick for me"}
                </button>

                {/* result card */}
                <AnimatePresence mode="wait">
                    {movie && (
                        <motion.div
                            key={movie.id}
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            className="w-full"
                        >
                            <div
                                onClick={() => router.push(`/details?id=${movie.id}&media_type=${movie.media_type}`)}
                                className="relative cursor-pointer group bg-[#18181b] border border-gray-800 hover:border-yellow-400/40 rounded-2xl p-5 md:p-7 flex flex-col sm:flex-row items-center sm:items-start gap-5 transition-all duration-300 hover:bg-[#1f1f22] text-left overflow-hidden"
                            >
                                {/* subtle glow behind poster */}
                                <div className="absolute -left-10 -top-10 w-40 h-40 bg-yellow-400/5 rounded-full blur-2xl pointer-events-none" />

                                {/* poster */}
                                <div className="flex-none relative">
                                    <Image
                                        src={movie.poster}
                                        alt={movie.title}
                                        width={160}
                                        height={240}
                                        className="rounded-xl object-cover shadow-2xl w-28 sm:w-36 md:w-40 group-hover:scale-[1.02] transition-transform duration-300"
                                    />
                                    {/* media type badge */}
                                    <span className="absolute top-2 left-2 flex items-center gap-1 bg-black/75 backdrop-blur-sm text-xs text-white px-2 py-0.5 rounded-full capitalize font-medium">
                                        {movie.media_type === "tv"
                                            ? <Tv size={10} />
                                            : <Film size={10} />
                                        }
                                        {movie.media_type === "tv" ? "Series" : "Movie"}
                                    </span>
                                </div>

                                {/* info */}
                                <div className="flex-1 flex flex-col justify-between gap-4 text-center sm:text-left">
                                    <div>
                                        <h3 className="text-white font-bold text-xl md:text-2xl leading-tight group-hover:text-yellow-400 transition-colors duration-200">
                                            {movie.title}
                                        </h3>
                                        <div className="flex items-center gap-1.5 mt-2 justify-center sm:justify-start">
                                            <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                            <span className="text-yellow-400 font-semibold">{movie.rating}</span>
                                            <span className="text-gray-500 text-sm">/ 10</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                                            We think you'll enjoy this one. Give it a shot!
                                        </p>
                                        <span className="inline-flex items-center gap-1.5 text-yellow-400 text-sm font-semibold group-hover:gap-2.5 transition-all duration-200">
                                            View details <ArrowRight size={15} />
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* pick again hint */}
                            <p className="mt-4 text-gray-600 text-xs text-center">
                                Not feeling it? Hit the button again for another pick.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}