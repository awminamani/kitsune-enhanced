// components/AnimeVault.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import type { Anime } from "@/lib/types";
import { Aurora, Grain } from "@/components/effects";
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

  const heroItems = trending.slice(0, Math.min(6, trending.length));
  const heroAnime = heroItems[heroIndex] ?? trending[0];

  useEffect(() => {
    if (heroItems.length <= 1) return;
    const t = setInterval(
      () => setHeroIndex((i) => (i + 1) % heroItems.length),
      8000
    );
    return () => clearInterval(t);
  }, [heroItems.length]);

  const handleCardClick = useCallback((anime: Anime) => {
    setOpenAnime(anime);
  }, []);

  const handleSearchSelect = useCallback((result: {
    id: string;
    title: string;
    cover: string;
    score: number | null;
    scoreSource?: 'anilist' | 'mal';
    year: number | null;
    genres: string[];
    episodes?: number;
  }) => {
    setSearchOpen(false);
  }, []);

  return (
    <>
      <Aurora />
      <Grain opacity={0.03} />

      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <MobileNav />

      <main>
        {heroAnime && (
          <AnimeHero
            anime={heroAnime}
            items={heroItems.length > 1 ? heroItems : undefined}
            activeIndex={heroIndex}
            onDotClick={setHeroIndex}
          />
        )}

        {trending.length > 0 && (
          <div className="relative z-10 -mt-8">
            <AnimeRail
              items={trending}
              title="Trending Now"
              onCardClick={handleCardClick}
            />
          </div>
        )}

        {movies.length > 0 && (
          <AnimeRail
            items={movies}
            title="Top Movies"
            className="pt-12"
            onCardClick={handleCardClick}
          />
        )}

        {topMal.length > 0 && (
          <AnimeRail
            items={topMal}
            title="Top Ranked"
            showRank
            className="pt-12"
            onCardClick={handleCardClick}
          />
        )}
      </main>

      <AnimeModal anime={openAnime} onClose={() => setOpenAnime(null)} />

      <SearchCommand
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onSelect={handleSearchSelect}
      />
    </>
  );
}
