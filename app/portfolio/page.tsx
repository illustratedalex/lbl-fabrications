import type { Metadata } from "next";
import { generateSiteMetadata, SitePage } from "../../components/site/SitePage";

export async function generateMetadata(): Promise<Metadata> {
  return generateSiteMetadata("/portfolio");
}

export default async function PortfolioPage({ searchParams }: { searchParams?: Promise<{ review?: string }> }) {
  return <SitePage path="/portfolio" searchParams={searchParams} />;
}
