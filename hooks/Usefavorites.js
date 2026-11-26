"use client";

import useSWR from "swr";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const fetcher = async (url) => {
  const res = await fetch(url);
  if (res.status === 401) return { success: false, unauthorized: true, favorites: [] };
  if (!res.ok) throw new Error("Failed to load favorites");
  return res.json();
};

const toastStyle = {
  background: "#1f1f1f",
  color: "#e5e5e5",
  border: "1px solid rgba(255, 255, 255, 0.12)",
};

// not logged in
const loginWarn = (msg) =>
  toast(msg, { id: "fav-toast", icon: "⚠️", duration: 2000, style: toastStyle });

// removed from favorites
const removedToast = (msg) =>
  toast(msg, { id: "fav-toast", icon: "💔", duration: 1500, style: toastStyle });

// docs saved before tv support have no mediaType, so treat missing as "movie"
const typeOf = (f) => f.mediaType || "movie";

export function useFavorites() {
  const router = useRouter();
  // Same key everywhere -> SWR dedupes, so 50 heart buttons = 1 network request
  const { data, error, isLoading, mutate } = useSWR("/api/favorites", fetcher);

  const favorites = data?.favorites ?? [];
  const isLoggedIn = !!data && !data.unauthorized;

  const isFavorite = (movieId, mediaType = "movie") =>
    favorites.some((f) => f.movieId === Number(movieId) && typeOf(f) === mediaType);

  async function toggleFavorite(movieId, mediaType = "movie") {
    const id = Number(movieId);

    if (!isLoggedIn) {
      loginWarn("Login to save favorites");
      router.push("/login");
      return;
    }

    const alreadyFav = isFavorite(id, mediaType);

    try {
      if (alreadyFav) {
        // REMOVE (optimistic: heart empties instantly, rolls back on error)
        const without = favorites.filter((f) => !(f.movieId === id && typeOf(f) === mediaType));
        await mutate(
          async () => {
            const res = await fetch(`/api/favorites/${id}?mediaType=${mediaType}`, {
              method: "DELETE",
            });
            if (!res.ok) throw new Error("Remove failed");
            return { ...data, favorites: without };
          },
          {
            optimisticData: { ...data, favorites: without },
            rollbackOnError: true,
            revalidate: false,
          }
        );
        removedToast("Removed from favorites");
      } else {
        // ADD (optimistic: heart fills instantly, real doc replaces placeholder)
        const placeholder = { movieId: id, mediaType, _optimistic: true };
        await mutate(
          async () => {
            const res = await fetch("/api/favorites", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ movieId: id, mediaType }),
            });
            if (!res.ok) throw new Error("Add failed");
            const json = await res.json();
            return { ...data, favorites: [json.favorite, ...favorites] };
          },
          {
            optimisticData: { ...data, favorites: [placeholder, ...favorites] },
            rollbackOnError: true,
            revalidate: false,
          }
        );
        toast.success("Added to favorites", { id: "fav-toast", duration: 1500 });
      }
    } catch (err) {
      toast.error("Something went wrong, try again", { id: "fav-toast", duration: 2500 });
    }
  }

  return { favorites, isLoading, error, isLoggedIn, isFavorite, toggleFavorite };
}