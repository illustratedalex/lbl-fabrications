"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MobileNav } from "./MobileNav";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/residential", label: "Residential" },
  { href: "/commercial", label: "Commercial" },
  { href: "/materials", label: "Materials" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="site-brand" aria-label="LBL Fabrications home">
          <span className="site-brand__mark">LBL</span>
          <span className="site-brand__text">
            <strong>LBL Fabrications</strong>
            <span>Custom Fabrication</span>
          </span>
        </Link>
        <nav className="site-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={pathname === item.href ? "is-active" : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="site-header__actions">
          <Link href="/contact" className="site-button site-button--primary">Start a Project</Link>
          <button
            type="button"
            className="site-menu-button"
            aria-expanded={open}
            aria-controls="lbl-mobile-nav"
            aria-label="Open navigation"
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
      <div id="lbl-mobile-nav">
        <MobileNav open={open} items={navItems} currentPath={pathname} onNavigate={() => setOpen(false)} />
      </div>
    </header>
  );
}
