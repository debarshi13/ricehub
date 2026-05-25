import { notFound } from "next/navigation";
import { getServerProfile, getServerRicesByUser } from "@/lib/supabase/server-queries";
import { ProfileClient } from "@/components/profile-client";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const profile = await getServerProfile(id);
    return {
      title: `${profile.display_name ?? profile.username} — RiceHub`,
      description: profile.bio
        ? `${profile.bio.slice(0, 155)}`
        : `Browse Linux desktop rices by ${profile.username} on RiceHub.`,
      openGraph: {
        title: `${profile.display_name ?? profile.username} on RiceHub`,
        description: profile.bio || `Linux rices by ${profile.username}`,
        url: `https://ricehub.fun/profile/${id}`,
        siteName: "RiceHub",
        type: "profile",
        images: profile.avatar_url ? [{ url: profile.avatar_url }] : undefined,
      },
    };
  } catch {
    return { title: "User not found — RiceHub" };
  }
}

export default async function ProfilePage({ params }: Props) {
  const { id } = await params;
  try {
    const [profile, rices] = await Promise.all([
      getServerProfile(id),
      getServerRicesByUser(id),
    ]);

    return <ProfileClient profile={profile} initialRices={rices} profileId={id} />;
  } catch {
    notFound();
  }
}
