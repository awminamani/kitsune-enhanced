'use client';

import Link from 'next/link';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Movies', href: '/movies' },
];

export default function MobileNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto mb-3 flex max-w-[280px] items-center justify-center rounded-full border border-border bg-bg-soft/90 px-6 py-2 shadow-2xl shadow-black/30 backdrop-blur-xl">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex flex-col items-center gap-0.5 rounded-full px-5 py-1.5 text-fg-muted transition-colors hover:text-fg"
          >
            <span className="text-xs font-medium">{link.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
