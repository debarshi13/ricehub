import type { MetadataRoute } from "next";
import { getAllRiceIds, getAllProfileIds } from "@/lib/supabase/server-queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [rices, profiles] = await Promise.all([
    getAllRiceIds().catch(() => []),
    getAllProfileIds().catch(() => []),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: "https://ricehub.fun",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://ricehub.fun/upload",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const ricePages: MetadataRoute.Sitemap = rices.map((r) => ({
    url: `https://ricehub.fun/rice/${r.id}`,
    lastModified: new Date(r.created_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const profilePages: MetadataRoute.Sitemap = profiles.map((p) => ({
    url: `https://ricehub.fun/profile/${p.id}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...ricePages, ...profilePages];
}
