'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import gsap from 'gsap';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Movies', href: '/movies' },
];

interface NavbarProps {
  onSearchOpen: () => void;
}

export default function Navbar({ onSearchOpen }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const idx = NAV_LINKS.findIndex(
      (l) => pathname === l.href || pathname.startsWith(l.href + '/')
    );
    if (idx !== -1) setActiveIndex(idx);
  }, [pathname]);

  useEffect(() => {
    const pill = pillRef.current;
    const activeLink = linkRefs.current[activeIndex];
    if (!pill || !activeLink) return;

    const navRect = navRef.current?.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    if (!navRect) return;

    const x = linkRect.left - navRect.left + linkRect.width / 2 - pill.offsetWidth / 2;

    gsap.to(pill, {
      x,
      duration: 0.4,
      ease: 'power3.out',
    });
  }, [activeIndex]);

  return (
    <header
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'backdrop-blur-xl bg-bg/80 border-b border-border shadow-lg shadow-black/10'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-14 md:h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <img
            src="/kitsune.png"
            alt="AnimeVault"
            width={28}
            height={28}
            className="rounded-lg transition-transform group-hover:scale-110"
          />
          <span className="font-display text-lg font-bold tracking-tight text-fg">
            AnimeVault
          </span>
        </Link>

        <div className="hidden md:flex items-center relative">
          <div
            ref={pillRef}
            className="absolute top-1/2 -translate-y-1/2 h-9 rounded-full bg-violet-500/15 border border-violet-500/20"
            style={{ width: 80 }}
          />
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              ref={(el) => { linkRefs.current[i] = el; }}
              className={`relative z-10 px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                activeIndex === i
                  ? 'text-violet-300'
                  : 'text-fg-muted hover:text-fg'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSearchOpen}
            className="flex items-center gap-2 rounded-full border border-border bg-bg-soft/60 px-3 py-1.5 text-sm text-fg-muted transition-all hover:border-violet-500/40 hover:text-fg hover:bg-bg-soft"
            aria-label="Search"
          >
            <Search size={16} />
            <span className="hidden sm:inline">Search...</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
