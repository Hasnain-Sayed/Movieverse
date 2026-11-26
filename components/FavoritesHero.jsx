"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

const IMG = "https://image.tmdb.org/t/p";
const MAX_SLIDES = 5; // how many latest favorites rotate in the hero
const INTERVAL = 5000; // ms between slides

export default function FavoritesHero({ favorites }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // newest favorites that have a backdrop (favorites list is already newest-first)
  const slides = useMemo(
    () => favorites.filter((m) => m.backdropPath).slice(0, MAX_SLIDES),
    [favorites]
  );

  // auto-rotate (stops on hover, or when there is only one slide)
  useEffect(() => {
    if (slides.length < 2 || paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), INTERVAL);
    return () => clearInterval(id);
  }, [slides.length, paused]);

  // index can point past the end if the user removes a favorite, so wrap it
  const activeIndex = slides.length ? index % slides.length : 0;
  const active = slides[activeIndex];

  return (
    <section
      className="relative h-80 w-full overflow-hidden sm:h-96 md:h-112 lg:h-128"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* all slides stacked, only the active one is visible (crossfade) */}
      {slides.length > 0 ? (
        slides.map((m, i) => (
          <Image
            key={`${m.mediaType || "movie"}-${m.movieId}`}
            src={`${IMG}/w1280${m.backdropPath}`}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className={`object-cover object-[center_30%] transition-opacity duration-1000 ${
              i === activeIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-yellow-400/20 to-black" />
      )}

      {/* gradients so text stays readable */}
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-black/30" />

      {/* text */}
      <div className="absolute inset-x-0 bottom-0 px-4 pb-6 sm:px-8 md:px-10 lg:px-16">
        <p className="text-xs uppercase tracking-widest text-yellow-400">Your collection</p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl md:text-5xl">My Favorites</h1>

        {active && (
          <motion.div
            key={`${active.mediaType || "movie"}-${active.movieId}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-2 text-sm text-white/60"
          >
            {activeIndex === 0 ? "Latest add: " : "Saved: "}
            <Link
              href={`/details?id=${active.movieId}&media_type=${active.mediaType || "movie"}`}
              className="text-white hover:underline"
            >
              {active.title}
            </Link>
            {active.voteAverage ? (
              <span className="text-yellow-400"> • ★ {active.voteAverage.toFixed(1)}</span>
            ) : null}
          </motion.div>
        )}
      </div>

      {/* dots (click to jump) */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 right-4 z-10 flex gap-2 sm:right-8 lg:right-16">
          {slides.map((m, i) => (
            <button
              key={`dot-${m.mediaType || "movie"}-${m.movieId}`}
              onClick={() => setIndex(i)}
              aria-label={`Show ${m.title}`}
              className={`h-2 rounded-full transition-all ${
                i === activeIndex ? "w-6 bg-yellow-400" : "w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}