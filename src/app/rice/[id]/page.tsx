import { notFound } from "next/navigation";
import { getServerRiceById } from "@/lib/supabase/server-queries";
import { RiceDetailClient } from "@/components/rice-detail-client";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const rice = await getServerRiceById(id);
    return {
      title: `${rice.title} — ${rice.wm} rice on RiceHub`,
      description: rice.description
        ? `${rice.description.slice(0, 155)}...`
        : `A ${rice.wm} desktop rice${rice.distro ? ` on ${rice.distro}` : ""} by ${rice.author_name}. Browse and download dotfiles on RiceHub.`,
      keywords: [
        rice.wm,
        rice.distro,
        "linux rice",
        "dotfiles",
        ...rice.tags,
      ].filter(Boolean),
      openGraph: {
        title: `${rice.title} — ${rice.wm} rice`,
        description: rice.description || `A ${rice.wm} rice by ${rice.author_name}`,
        url: `https://ricehub.fun/rice/${id}`,
        siteName: "RiceHub",
        type: "article",
        images: rice.screenshots[0]
          ? [{ url: rice.screenshots[0], width: 1920, height: 1080 }]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: `${rice.title} — ${rice.wm} rice`,
        description: rice.description || `A ${rice.wm} rice by ${rice.author_name}`,
        images: rice.screenshots[0] ? [rice.screenshots[0]] : undefined,
      },
    };
  } catch {
    return { title: "Rice not found — RiceHub" };
  }
}

export default async function RiceDetail({ params }: Props) {
  const { id } = await params;
  try {
    const rice = await getServerRiceById(id);
    return <RiceDetailClient rice={rice} />;
  } catch {
    notFound();
  }
}
