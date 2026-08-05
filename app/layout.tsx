import type { Metadata } from "next";
import "./globals.css";

function shouldNoIndex() {
  return process.env.VERCEL_ENV !== "production";
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://lbl.staging.deadsignal.co"),
  title: "LBL Fabrications | Custom Natural Stone & Solid Surface Fabrication",
  description:
    "LBL Fabrications builds premium natural stone and solid surface work for residential and commercial projects.",
  robots: shouldNoIndex()
    ? { index: false, follow: false }
    : { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
