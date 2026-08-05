import type { Metadata } from "next";
import { generateSiteMetadata, SitePage } from "../../components/site/SitePage";

export async function generateMetadata(): Promise<Metadata> {
  return generateSiteMetadata("/about");
}

export default async function AboutPage({ searchParams }: { searchParams?: Promise<{ review?: string }> }) {
  return <SitePage path="/about" searchParams={searchParams} />;
}
