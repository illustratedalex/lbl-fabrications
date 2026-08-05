import type { Metadata } from "next";
import { generateSiteMetadata, SitePage } from "../../components/site/SitePage";

export async function generateMetadata(): Promise<Metadata> {
  return generateSiteMetadata("/materials");
}

export default async function MaterialsPage({ searchParams }: { searchParams?: Promise<{ review?: string }> }) {
  return <SitePage path="/materials" searchParams={searchParams} />;
}
