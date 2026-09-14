'use client';

import Link from 'next/link';
import { Search, Home, Film } from 'lucide-react';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Movies', href: '/movies', icon: Film },
];

interface MobileNavProps {
  onSearchOpen: () => void;
}

export default function MobileNav({ onSearchOpen }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto mb-3 flex max-w-[320px] items-center justify-between rounded-full border border-border bg-bg-soft/90 px-3 py-2 shadow-2xl shadow-black/30 backdrop-blur-xl">
        {NAV_LINKS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 rounded-full px-4 py-1.5 transition-all ${
                active
                  ? 'text-cyan-400 bg-cyan-400/10'
                  : 'text-fg-muted hover:text-fg'
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}

        <button
          onClick={onSearchOpen}
          className="flex flex-col items-center gap-0.5 rounded-full px-4 py-1.5 text-fg-muted transition-colors hover:text-cyan-400"
          aria-label="Search"
        >
          <Search size={20} />
          <span className="text-[10px] font-medium">Search</span>
        </button>
      </div>
    </nav>
  );
}
