"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useFavorites } from "@/hooks/Usefavorites";
import FavoriteButton from "@/components/FavoriteButton";
import FavoritesHero from "@/components/FavoritesHero";

const IMG = "https://image.tmdb.org/t/p";
const typeOf = (m) => m.mediaType || "movie";

const TABS = [
  { key: "all", label: "All" },
  { key: "movie", label: "Movies" },
  { key: "tv", label: "Series" },
];

const SORTS = [
  { key: "recent", label: "Recently added", fn: (a, b) => new Date(b.createdAt) - new Date(a.createdAt) },
  { key: "rating", label: "Highest rated", fn: (a, b) => (b.voteAverage || 0) - (a.voteAverage || 0) },
  { key: "release", label: "Newest release", fn: (a, b) => (b.releaseDate || "").localeCompare(a.releaseDate || "") },
  { key: "title", label: "Title A-Z", fn: (a, b) => a.title.localeCompare(b.title) },
  { key: "runtime", label: "Longest runtime", fn: (a, b) => (b.runtime || 0) - (a.runtime || 0) },
];

/* ---------- helpers ---------- */

function formatRuntime(min) {
  if (!min) return null;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}

function formatTotal(min) {
  if (!min) return "0h";
  return min < 60 ? `${min}m` : `${Math.round(min / 60)}h`;
}

function timeAgo(date) {
  if (!date) return "";
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const units = [["y", 31536000], ["mo", 2592000], ["w", 604800], ["d", 86400], ["h", 3600], ["m", 60]];
  for (const [u, sec] of units) {
    if (s >= sec) return `${Math.floor(s / sec)}${u} ago`;
  }
  return "just now";
}

/* ---------- small components ---------- */

function Stat({ label, value, sub }) {
  return (
    <div className="rounded-xl bg-[#18181b] p-4 ring-1 ring-white/5">
      <p className="text-xs uppercase tracking-wider text-white/50">{label}</p>
      <p className="mt-1 truncate text-2xl font-bold text-yellow-400">{value}</p>
      <p className="mt-0.5 truncate text-xs text-white/40">{sub}</p>
    </div>
  );
}

function FavCard({ m, index }) {
  const type = typeOf(m);
  const href = `/details?id=${m.movieId}&media_type=${type}`;
  const year = m.releaseDate ? m.releaseDate.slice(0, 4) : null;
  const length =
    type === "tv"
      ? m.numberOfSeasons
        ? `${m.numberOfSeasons} Season${m.numberOfSeasons > 1 ? "s" : ""}`
        : null
      : formatRuntime(m.runtime);
  const meta = [year, length].filter(Boolean).join(" • ");
  const lang = m.originalLanguage ? m.originalLanguage.toUpperCase() : null;
  const genres = (m.genres || []).slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index, 12) * 0.03 }}
      className="group relative aspect-2/3 overflow-hidden rounded-xl bg-[#18181b] shadow-lg ring-1 ring-white/5 transition hover:-translate-y-1 hover:ring-yellow-400/60"
    >
      {/* poster + click target */}
      <Link href={href} aria-label={m.title} className="absolute inset-0">
        <Image
          src={m.posterPath ? `${IMG}/w500${m.posterPath}` : "/default_poster.jpg"}
          alt={m.title}
          fill
          sizes="(min-width:1536px) 14vw, (min-width:1280px) 16vw, (min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw"
          className="object-cover transition duration-500 group-hover:scale-110"
          quality={75}
        />
      </Link>

      {/* type badge */}
      <span
        className={`pointer-events-none absolute left-2 top-2 z-10 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide backdrop-blur ${
          type === "tv" ? "bg-yellow-400 text-black" : "bg-black/60 text-white"
        }`}
      >
        {type === "tv" ? "Series" : "Movie"}
      </span>

      {/* heart (remove from favorites) */}
      <FavoriteButton movieId={m.movieId} mediaType={type} className="absolute right-2 top-2 z-20" />

      {/* default info (fades out on hover) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-linear-to-t from-black via-black/70 to-transparent p-3 pt-10 transition duration-300 group-hover:opacity-0">
        <h3 className="line-clamp-2 text-sm font-semibold md:text-base">{m.title}</h3>
        <p className="mt-0.5 text-xs text-white/70">
          {m.voteAverage ? <span className="text-yellow-400">★ {m.voteAverage.toFixed(1)}</span> : null}
          {m.voteAverage && meta ? " • " : ""}
          {meta}
        </p>
      </div>

      {/* hover details: uses overview, tagline, genres, runtime/seasons, language, createdAt */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-end gap-2 bg-black/85 p-3 opacity-0 transition duration-300 group-hover:opacity-100">
        <h3 className="line-clamp-2 text-sm font-semibold md:text-base">{m.title}</h3>

        {m.tagline ? (
          <p className="line-clamp-2 text-xs italic text-yellow-400/90">“{m.tagline}”</p>
        ) : null}

        {m.overview ? (
          <p className="line-clamp-5 text-xs leading-relaxed text-white/75">{m.overview}</p>
        ) : null}

        {genres.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {genres.map((g) => (
              <span key={g} className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/80">
                {g}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-[11px] text-white/50">
          <span>{[length, lang].filter(Boolean).join(" • ")}</span>
          <span>Added {timeAgo(m.createdAt)}</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------- page ---------- */

export default function FavoritesPage() {
  const { favorites, isLoading, error, isLoggedIn } = useFavorites();

  const [tab, setTab] = useState("all");
  const [genre, setGenre] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recent");

  // skip placeholder while POST is in flight
  const real = useMemo(() => favorites.filter((m) => !m._optimistic), [favorites]);

  const stats = useMemo(() => {
    const movies = real.filter((m) => typeOf(m) === "movie");
    const series = real.filter((m) => typeOf(m) === "tv");
    const minutes = movies.reduce((s, m) => s + (m.runtime || 0), 0);
    const seasons = series.reduce((s, m) => s + (m.numberOfSeasons || 0), 0);
    const rated = real.filter((m) => m.voteAverage > 0);
    const avg = rated.length ? rated.reduce((s, m) => s + m.voteAverage, 0) / rated.length : 0;

    const counts = {};
    real.forEach((m) => (m.genres || []).forEach((g) => (counts[g] = (counts[g] || 0) + 1)));
    const genreList = Object.entries(counts).sort((a, b) => b[1] - a[1]);

    return { movies: movies.length, series: series.length, minutes, seasons, avg, genreList };
  }, [real]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sortFn = SORTS.find((s) => s.key === sort).fn;
    return real
      .filter(
        (m) =>
          (tab === "all" || typeOf(m) === tab) &&
          (!genre || (m.genres || []).includes(genre)) &&
          (!q || m.title.toLowerCase().includes(q))
      )
      .sort(sortFn);
  }, [real, tab, genre, query, sort]);

  const tabCount = { all: real.length, movie: stats.movies, tv: stats.series };
  const topGenre = stats.genreList[0];
  const filtersActive = tab !== "all" || genre || query;

  /* ----- states ----- */

  if (isLoading) {
    return (
      <main className="min-h-screen bg-black px-4 py-10 sm:px-8 md:px-10 lg:px-16">
        <div className="mb-6 h-40 animate-pulse rounded-2xl bg-white/5" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-2/3 animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return <p className="bg-black p-10 text-center text-red-400">Could not load favorites. Try refreshing.</p>;
  }

  if (!isLoggedIn) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center bg-black px-4 text-center text-white">
        <p className="mb-2 text-3xl font-bold">Your favorites live here</p>
        <p className="mb-6 text-white/60">Login to see the movies and series you saved.</p>
        <Link href="/login" className="rounded-lg bg-yellow-400 px-5 py-2 font-medium text-black hover:bg-amber-400">
          Go to login
        </Link>
      </main>
    );
  }

  if (real.length === 0) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center bg-black px-4 text-center text-white">
        <p className="mb-2 text-3xl font-bold">No favorites yet</p>
        <p className="mb-6 text-white/60">Tap the heart on any movie or series to save it here.</p>
        <Link href="/" className="rounded-lg bg-yellow-400 px-5 py-2 font-medium text-black hover:bg-amber-400">
          Browse movies
        </Link>
      </main>
    );
  }

  /* ----- main view ----- */

  return (
    <main className="min-h-screen bg-black text-white">
      {/* hero */}
      <FavoritesHero favorites={real} />

      <div className="px-4 pb-12 sm:px-8 md:px-10 lg:px-16">
        {/* stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Saved" value={real.length} sub={`${stats.movies} movies • ${stats.series} series`} />
          <Stat
            label="Watch time"
            value={formatTotal(stats.minutes)}
            sub={stats.seasons ? `movies + ${stats.seasons} seasons of series` : "across your movies"}
          />
          <Stat label="Avg rating" value={stats.avg ? `★ ${stats.avg.toFixed(1)}` : "-"} sub="across favorites" />
          <Stat
            label="Top genre"
            value={topGenre ? topGenre[0] : "-"}
            sub={topGenre ? `${topGenre[1]} title${topGenre[1] > 1 ? "s" : ""}` : "no genre data"}
          />
        </div>

        {/* controls */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`rounded-full px-4 py-1.5 text-sm transition ${
                  tab === t.key ? "bg-yellow-400 font-medium text-black" : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                {t.label} <span className="opacity-60">{tabCount[t.key]}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search favorites..."
              className="w-44 rounded-lg bg-[#18181b] px-3 py-2 text-sm text-white ring-1 ring-white/10 placeholder:text-white/40 focus:outline-none focus:ring-yellow-400 sm:w-56"
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg bg-[#18181b] px-3 py-2 text-sm text-white ring-1 ring-white/10 focus:outline-none focus:ring-yellow-400"
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key} className="bg-[#18181b]">
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* genre chips (built from the genres stored in your database) */}
        {stats.genreList.length > 0 && (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setGenre("")}
              className={`shrink-0 rounded-full px-3 py-1 text-xs transition ${
                !genre ? "bg-white text-black" : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              All genres
            </button>
            {stats.genreList.slice(0, 12).map(([g, count]) => (
              <button
                key={g}
                onClick={() => setGenre(genre === g ? "" : g)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs transition ${
                  genre === g ? "bg-white text-black" : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                {g} <span className="opacity-50">{count}</span>
              </button>
            ))}
          </div>
        )}

        <p className="mt-4 mb-4 text-sm text-white/50">
          Showing {shown.length} of {real.length}
        </p>

        {/* grid */}
        {shown.length === 0 ? (
          <div className="rounded-xl bg-[#18181b] p-10 text-center">
            <p className="mb-3 text-white/70">Nothing matches these filters.</p>
            {filtersActive && (
              <button
                onClick={() => {
                  setTab("all");
                  setGenre("");
                  setQuery("");
                }}
                className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-medium text-black hover:bg-amber-400"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7">
            {shown.map((m, i) => (
              <FavCard key={`${typeOf(m)}-${m.movieId}`} m={m} index={i} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}