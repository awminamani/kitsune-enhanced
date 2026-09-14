'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Search, Home, Compass, Bookmark } from 'lucide-react';

const MOBILE_LINKS = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Discover', href: '/discover', icon: Compass },
  { label: 'Saved', href: '/saved', icon: Bookmark },
];

interface MobileNavProps {
  onSearchOpen: () => void;
}

export default function MobileNav({ onSearchOpen }: MobileNavProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto mb-3 flex max-w-xs items-center justify-between rounded-full border border-border bg-bg-soft/90 px-2 py-2 shadow-2xl shadow-black/30 backdrop-blur-xl">
        {/* Search button */}
        <button
          onClick={onSearchOpen}
          className="flex flex-col items-center gap-0.5 rounded-full px-3 py-1.5 text-fg-muted transition-colors hover:text-cyan-400"
          aria-label="Search"
        >
          <Search size={20} />
          <span className="text-[10px] font-medium">Search</span>
        </button>

        {/* Nav links */}
        {MOBILE_LINKS.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 rounded-full px-3 py-1.5 transition-all ${
                active
                  ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]'
                  : 'text-fg-muted hover:text-fg'
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
