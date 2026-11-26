"use client";

import { useState } from "react";
import { useFavorites } from "@/hooks/Usefavorites";

export default function FavoriteButton({ movieId, mediaType = "movie", className = "" }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [busy, setBusy] = useState(false);

  const fav = isFavorite(movieId, mediaType);

  async function handleClick(e) {
    // card is usually wrapped in a <Link>, so stop navigation on heart click
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    await toggleFavorite(movieId, mediaType);
    setBusy(false);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      aria-label={fav ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={fav}
      className={`rounded-full bg-black/50 p-2 backdrop-blur transition hover:scale-110 disabled:opacity-60 ${
        fav ? "text-red-500" : "text-white"
      } ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill={fav ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round" 
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}