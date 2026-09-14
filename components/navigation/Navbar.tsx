'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search } from 'lucide-react';

function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}
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

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Determine active link from pathname
  useEffect(() => {
    const idx = NAV_LINKS.findIndex(
      (l) => pathname === l.href || pathname.startsWith(l.href + '/')
    );
    if (idx !== -1) setActiveIndex(idx);
  }, [pathname]);

  // GSAP pill slide animation
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
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <img
            src="/kitsune.png"
            alt="AnimeVault"
            width={32}
            height={32}
            className="rounded-lg transition-transform group-hover:scale-110"
          />
          <span className="font-display text-xl font-bold tracking-tight text-fg">
            AnimeVault
          </span>
        </Link>

        {/* Center: Nav links with animated pill */}
        <div className="hidden md:flex items-center relative">
          {/* Animated pill background */}
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

        {/* Right: Search + GitHub */}
        <div className="flex items-center gap-3">
          <button
            onClick={onSearchOpen}
            className="flex items-center gap-2 rounded-full border border-border bg-bg-soft/60 px-3.5 py-2 text-sm text-fg-muted transition-all hover:border-violet-500/40 hover:text-fg hover:bg-bg-soft"
            aria-label="Search"
          >
            <Search size={16} />
            <span className="hidden sm:inline">Search anime...</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-bg px-1.5 py-0.5 text-[10px] font-mono text-fg-muted">
              ⌘K
            </kbd>
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-9 h-9 rounded-full border border-border bg-bg-soft/60 text-fg-muted transition-all hover:border-violet-500/40 hover:text-fg hover:bg-bg-soft"
            aria-label="GitHub"
          >
            <GithubIcon size={16} />
          </a>
        </div>
      </nav>
    </header>
  );
}
