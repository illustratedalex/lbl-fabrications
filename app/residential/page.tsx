import type { Metadata } from "next";
import { generateSiteMetadata, SitePage } from "../../components/site/SitePage";

export async function generateMetadata(): Promise<Metadata> {
  return generateSiteMetadata("/residential");
}

export default async function ResidentialPage({ searchParams }: { searchParams?: Promise<{ review?: string }> }) {
  return <SitePage path="/residential" searchParams={searchParams} />;
}
