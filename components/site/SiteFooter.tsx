import Link from "next/link";

const footerLinks = [
  { href: "/residential", label: "Residential" },
  { href: "/commercial", label: "Commercial" },
  { href: "/materials", label: "Materials" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div>
          <p className="site-footer__brand">LBL Fabrications</p>
          <p className="site-footer__copy">
            Natural stone and solid surface fabrication for residential and commercial work across New England and the Mid-Atlantic.
          </p>
        </div>
        <nav className="site-footer__nav" aria-label="Footer navigation">
          {footerLinks.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
        </nav>
        <div className="site-footer__meta">
          <p>200 Clinton Street<br />Springfield, VT 05156</p>
          <p><a href="tel:8028858677">802-885-8677</a></p>
          <p>Service area: New England & Mid-Atlantic</p>
        </div>
      </div>
      <div className="site-footer__bottom">
        <p>Built and managed by DeadSignal.</p>
      </div>
    </footer>
  );
}
