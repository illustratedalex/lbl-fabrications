import type { Metadata } from "next";
import { generateSiteMetadata, SitePage } from "../components/site/SitePage";

export async function generateMetadata(): Promise<Metadata> {
  return generateSiteMetadata("/");
}

export default async function HomePage({ searchParams }: { searchParams?: Promise<{ review?: string }> }) {
  return <SitePage path="/" searchParams={searchParams} />;
}
