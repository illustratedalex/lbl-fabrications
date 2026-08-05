"use client";

import Link from "next/link";

type MobileNavProps = {
  open: boolean;
  items: Array<{ href: string; label: string }>;
  currentPath: string;
  onNavigate: () => void;
};

export function MobileNav({ open, items, currentPath, onNavigate }: MobileNavProps) {
  return (
    <div className={`mobile-nav${open ? " mobile-nav--open" : ""}`} aria-hidden={!open}>
      <nav>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={currentPath === item.href ? "is-active" : undefined}
          >
            {item.label}
          </Link>
        ))}
        <Link href="/contact" onClick={onNavigate} className="mobile-nav__cta">Start a Project</Link>
      </nav>
    </div>
  );
}
