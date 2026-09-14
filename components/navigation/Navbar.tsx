'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Movies', href: '/movies' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                pathname === link.href || pathname.startsWith(link.href + '/')
                  ? 'text-violet-300 bg-violet-500/15'
                  : 'text-fg-muted hover:text-fg'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
