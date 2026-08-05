import type { Metadata } from "next";
import { generateSiteMetadata, SitePage } from "../../components/site/SitePage";

export async function generateMetadata(): Promise<Metadata> {
  return generateSiteMetadata("/contact");
}

export default async function ContactPage({ searchParams }: { searchParams?: Promise<{ review?: string }> }) {
  return <SitePage path="/contact" searchParams={searchParams} />;
}
