import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // TMDB id (movieId naam hai but works for both movies and tv)
    movieId: { type: Number, required: true },

    // "movie" or "tv" (same numeric id can exist in both, so we store the type)
    mediaType: { type: String, enum: ["movie", "tv"], default: "movie", required: true },

    // Card fields
    title: { type: String, required: true }, // movie.title or tv.name
    posterPath: { type: String, default: null },
    voteAverage: { type: Number, default: 0 },
    releaseDate: { type: String, default: "" }, // release_date or first_air_date

    //Detail page fields
    backdropPath: { type: String, default: null },
    overview: { type: String, default: "" },
    tagline: { type: String, default: "" },
    genres: { type: [String], default: [] },
    runtime: { type: Number, default: 0 }, // minutes (tv: first episode_run_time)
    numberOfSeasons: { type: Number, default: 0 }, // tv only
    originalLanguage: { type: String, default: "" },
  },
  { timestamps: true }
);

// IMP-LINE - One user can favorite a given movie/series only once
FavoriteSchema.index({ userId: 1, mediaType: 1, movieId: 1 }, { unique: true });

// Favorites page: newest first (basically descending order)
FavoriteSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Favorite ||
  mongoose.model("Favorite", FavoriteSchema);