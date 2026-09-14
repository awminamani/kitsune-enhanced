// components/AnimeVault.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import type { Anime } from "@/lib/types";
import { Aurora, Grain, ParticlesBackground } from "@/components/effects";
import { Navbar, MobileNav, SearchCommand } from "@/components/navigation";
import AnimeHero from "@/components/anime/AnimeHero";
import { AnimeRail } from "@/components/anime/AnimeRail";
import AnimeModal from "@/components/anime/AnimeModal";

interface AnimeVaultProps {
  trending: Anime[];
  movies: Anime[];
  topMal: Anime[];
  genres: string[];
}

export default function AnimeVault({
  trending,
  movies,
  topMal,
  genres,
}: AnimeVaultProps) {
  const [openAnime, setOpenAnime] = useState<Anime | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);

  // Build hero pool: top of trending
  const heroItems = trending.slice(0, Math.min(6, trending.length));
  const heroAnime = heroItems[heroIndex] ?? trending[0];

  // Auto-rotate hero
  useEffect(() => {
    if (heroItems.length <= 1) return;
    const t = setInterval(
      () => setHeroIndex((i) => (i + 1) % heroItems.length),
      8000
    );
    return () => clearInterval(t);
  }, [heroItems.length]);

  const handleSearchSelect = useCallback((result: {
    id: number;
    title: string;
    coverImage: string;
    score: number | null;
    year: number | null;
  }) => {
    setSearchOpen(false);
    console.log("Selected:", result.title);
  }, []);

  return (
    <>
      {/* Background effects */}
      <Aurora />
      <Grain opacity={0.03} />
      <ParticlesBackground />

      {/* Navigation */}
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <MobileNav onSearchOpen={() => setSearchOpen(true)} />

      {/* Hero */}
      <main>
        {heroAnime && (
          <AnimeHero
            anime={heroAnime}
            items={heroItems.length > 1 ? heroItems : undefined}
            activeIndex={heroIndex}
            onDotClick={setHeroIndex}
          />
        )}

        {/* Trending rail */}
        {trending.length > 0 && (
          <div className="relative z-10 -mt-8">
            <AnimeRail
              items={trending}
              title="Trending Now"
              viewAllHref="/trending"
            />
          </div>
        )}

        {/* Top Movies rail */}
        {movies.length > 0 && (
          <AnimeRail
            items={movies}
            title="Top Movies"
            viewAllHref="/movies"
            className="pt-12"
          />
        )}

        {/* MAL Top 10 */}
        {topMal.length > 0 && (
          <AnimeRail
            items={topMal}
            title="Top Ranked on MyAnimeList"
            showRank
            className="pt-12"
          />
        )}

        {/* Genre cloud */}
        {genres.length > 0 && (
          <section className="px-4 sm:px-6 lg:px-8 py-12">
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
      </main>

      {/* Detail modal */}
      <AnimeModal anime={openAnime} onClose={() => setOpenAnime(null)} />

      {/* Search command */}
      <SearchCommand
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onSelect={handleSearchSelect}
      />
    </>
  );
}
