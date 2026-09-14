// app/movies/page.tsx
import { getTopMovies } from "@/lib/anime-vault";
import { getGenreCollection } from "@/lib/anime-vault";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Movies — AnimeVault",
  description: "Top-rated anime movies on AnimeVault.",
};

export const revalidate = 86400;

export default async function MoviesPage() {
  const [movies, genres] = await Promise.all([
    getTopMovies(24).catch(() => []),
    getGenreCollection().catch(() => [] as string[]),
  ]);

  return (
    <div className="min-h-screen bg-bg pt-20">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">
          Top Movies
        </h1>
        <p className="text-text-muted mb-8">
          The highest-rated anime movies of all time.
        </p>

        {movies.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-text-muted">
            <p>No movies found — try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="group relative rounded-lg overflow-hidden bg-bg-card border border-border cursor-pointer transition-transform hover:scale-[1.03] hover:border-accent-violet/40"
              >
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={movie.cover || "/placeholder.svg"}
                    alt={movie.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                  {movie.score != null && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-black/60 backdrop-blur-sm px-1.5 py-1 text-xs font-semibold text-amber-400">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.8 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z"/></svg>
                      <span>{movie.scoreSource === 'mal' ? movie.score.toFixed(2) : `${movie.score}%`}</span>
                    </div>
                  )}
                </div>
                <div className="p-2.5">
                  <p className="text-xs font-medium text-text line-clamp-1">{movie.title}</p>
                  <p className="text-[10px] text-text-muted mt-0.5 line-clamp-1">
                    {[movie.year, 'Movie'].filter(Boolean).join(' · ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {genres.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight mb-4">
              Browse by Genre
            </h2>
            <div className="flex flex-wrap gap-2">
              {genres.map((g) => (
                <button
                  key={g}
                  className="px-3 py-1.5 text-sm rounded-full bg-bg-card border border-border text-text-muted hover:text-text hover:border-accent-violet/40 transition-colors"
                >
                  {g}
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
