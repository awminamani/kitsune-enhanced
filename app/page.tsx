// app/page.tsx
import { getTrending, getTopMovies } from "@/lib/anime-vault";
import { getGenreCollection } from "@/lib/anime-vault";
import { getTopMal } from "@/lib/jikan";
import AnimeVault from "@/components/AnimeVault";

// Revalidate the whole page every 30 min; per-fetch caches govern the rest.
export const revalidate = 1800;

export default async function Page() {
  const [trending, movies, topMal, genres] = await Promise.all([
    getTrending(12).catch(() => []),
    getTopMovies(12).catch(() => []),
    getTopMal(10).catch(() => []),
    getGenreCollection().catch(() => [] as string[]),
  ]);

  return (
    <AnimeVault
      trending={trending}
      movies={movies}
      topMal={topMal}
      genres={genres}
    />
  );
}
