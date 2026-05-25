"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getProfile, getRicesByUser, getScreenshotUrl, deleteRice } from "@/lib/supabase/queries";
import { RiceCard } from "@/components/rice-card";
import { SleepyRiceBowl } from "@/components/rice-illustration";
import { useAuth } from "@/lib/supabase/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useScrollOpacity } from "@/components/navbar";
import { ArrowLeft, Terminal, Upload, ExternalLink, Trash2 } from "lucide-react";
import type { Database } from "@/lib/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [rices, setRices] = useState<
    Array<{
      id: string;
      title: string;
      author: string;
      authorAvatar: string;
      wm: string;
      distro: string;
      tags: string[];
      screenshots: string[];
      description: string;
      dots: string;
      tips: number;
      downloads: number;
      createdAt: string;
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isOwnProfile = user?.id === id;
  const navOpacity = useScrollOpacity();

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      try {
        const [profileData, ricesData] = await Promise.all([
          getProfile(supabase, id),
          getRicesByUser(supabase, id),
        ]);

        setProfile(profileData);

        const mapped = await Promise.all(
          ricesData.map(async (r) => {
            const screenshots = await Promise.all(
              (r.screenshots ?? [])
                .sort((a: { display_order: number }, b: { display_order: number }) => a.display_order - b.display_order)
                .map((s: { storage_path: string }) => getScreenshotUrl(supabase, s.storage_path))
            );

            return {
              id: r.id,
              title: r.title,
              author: r.profiles?.username ?? "unknown",
              authorAvatar: r.profiles?.avatar_url ?? "",
              wm: r.wm,
              distro: r.distro,
              tags: r.tags,
              screenshots:
                screenshots.length > 0
                  ? screenshots
                  : [`https://placehold.co/1920x1080/1a1520/f8fafc?text=${encodeURIComponent(r.title)}`],
              description: r.description,
              dots: r.dots_url ?? "",
              tips: r.tip_count,
              downloads: r.downloads,
              createdAt: r.created_at.split("T")[0],
            };
          })
        );

        setRices(mapped);
      } catch {
        // Profile not found
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleDelete(riceId: string) {
    if (!confirm("Delete this rice? This cannot be undone.")) return;
    try {
      const supabase = createClient();
      await deleteRice(supabase, riceId);
      setRices(rices.filter((r) => r.id !== riceId));
    } catch {
      alert("Failed to delete rice.");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="font-mono text-2xl">404</p>
          <p className="text-muted-foreground">User not found</p>
          <Link href="/" className="text-primary hover:underline text-sm">
            Back to browse
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <nav
        className="fixed top-4 left-4 right-4 z-50 glass-strong rounded-2xl transition-opacity duration-150"
        style={{ opacity: navOpacity, pointerEvents: navOpacity < 0.1 ? "none" : "auto" }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <Terminal className="w-5 h-5 text-primary" />
            <span className="font-heading font-bold text-sm text-foreground">
              RiceHub
            </span>
          </Link>
        </div>
      </nav>

      <div className="pt-28 pb-24 px-6">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="flex items-center gap-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profile.avatar_url ?? undefined} />
              <AvatarFallback className="bg-secondary text-2xl font-heading">
                {profile.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h1 className="font-heading text-2xl font-bold">
                {profile.display_name ?? profile.username}
              </h1>
              <p className="text-muted-foreground text-sm font-mono">
                @{profile.username}
              </p>
              {profile.bio && (
                <p className="text-sm text-muted-foreground mt-2">
                  {profile.bio}
                </p>
              )}
              {profile.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer mt-1"
                >
                  GitHub <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="font-heading text-xl font-bold">
              Rices ({rices.length})
            </h2>

            {rices.length === 0 ? (
              <div className="flex flex-col items-center py-16 space-y-4">
                <SleepyRiceBowl className="w-24 h-24 opacity-60" />
                <p className="text-muted-foreground text-sm">
                  No rices uploaded yet.
                </p>
                <Link href="/upload">
                  <Button
                    variant="outline"
                    className="cursor-pointer gap-2 border-white/10"
                  >
                    <Upload className="w-4 h-4" />
                    Upload your first rice
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rices.map((rice) => (
                  <div key={rice.id} className="relative group">
                    <RiceCard rice={rice} />
                    {isOwnProfile && (
                      <button
                        onClick={() => handleDelete(rice.id)}
                        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
