import type { Metadata } from "next";
import { generateSiteMetadata, SitePage } from "../../components/site/SitePage";

export async function generateMetadata(): Promise<Metadata> {
  return generateSiteMetadata("/commercial");
}

export default async function CommercialPage({ searchParams }: { searchParams?: Promise<{ review?: string }> }) {
  return <SitePage path="/commercial" searchParams={searchParams} />;
}
