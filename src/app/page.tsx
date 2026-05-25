"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useMemo } from "react";
import { Navbar } from "@/components/navbar";
import { RiceCard } from "@/components/rice-card";
import { WmFilter } from "@/components/wm-filter";
import { RiceBowl, SleepyRiceBowl } from "@/components/rice-illustration";
import { createClient } from "@/lib/supabase/client";
import { getRices, getScreenshotUrl } from "@/lib/supabase/queries";
import type { Rice as MockRice } from "@/lib/mock-data";
import { Upload, ArrowDown, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const [search, setSearch] = useState("");
  const [wmFilter, setWmFilter] = useState("All");
  const [rices, setRices] = useState<MockRice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const data = await getRices(supabase);

        const mapped = await Promise.all(
          data.map(async (r) => {
            const screenshots = await Promise.all(
              (r.screenshots ?? [])
                .sort(
                  (a: { display_order: number }, b: { display_order: number }) =>
                    a.display_order - b.display_order
                )
                .map((s: { storage_path: string }) =>
                  getScreenshotUrl(supabase, s.storage_path)
                )
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
                  : [
                      `https://placehold.co/1920x1080/1a1520/f8fafc?text=${encodeURIComponent(r.title)}`,
                    ],
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
        // Supabase not configured yet — show empty state
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    return rices.filter((rice) => {
      const matchesWm = wmFilter === "All" || rice.wm === wmFilter;
      const matchesSearch =
        !search ||
        rice.title.toLowerCase().includes(search.toLowerCase()) ||
        rice.author.toLowerCase().includes(search.toLowerCase()) ||
        rice.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      return matchesWm && matchesSearch;
    });
  }, [rices, search, wmFilter]);

  return (
    <>
      <Navbar search={search} onSearchChange={setSearch} />

      <section className="relative min-h-[90vh] flex items-center justify-center px-6 pt-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-purple-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-4xl mx-auto flex flex-col items-center text-center space-y-6">
          <RiceBowl className="w-40 h-40 md:w-52 md:h-52 drop-shadow-2xl" />

          <div className="space-y-4">
            <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              Where Linux desktops
              <br />
              find a <span className="text-primary">home</span>
              <span className="text-muted-foreground">.</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Share your rice. Support your favorite creators.
              <br />
              No paywalls, no gatekeeping — just dotfiles and good taste.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Link href="/upload">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/80 cursor-pointer gap-2 h-12 px-6"
              >
                <Upload className="w-4 h-4" />
                Share your rice
              </Button>
            </Link>
            <a
              href="#browse"
              className="h-12 px-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer glass rounded-lg"
            >
              Browse
              <ArrowDown className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      <section id="browse" className="px-6 pb-24 pt-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-bold">Browse rices</h2>
            <WmFilter selected={wmFilter} onSelect={setWmFilter} />
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-6">
              <SleepyRiceBowl className="w-32 h-32 opacity-80" />
              <div className="text-center space-y-2">
                <p className="font-heading text-lg text-muted-foreground">
                  No rices here yet
                </p>
                <p className="text-sm text-muted-foreground/60 max-w-sm">
                  This bowl is empty. Be the first to share your desktop config
                  and inspire the community.
                </p>
              </div>
              <Link href="/upload">
                <Button
                  variant="outline"
                  className="cursor-pointer gap-2 border-white/10 hover:border-primary/30 hover:text-primary"
                >
                  <Upload className="w-4 h-4" />
                  Upload a rice
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((rice) => (
                <RiceCard key={rice.id} rice={rice} />
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <span className="font-heading">RiceHub</span>
          <a
            href="https://ko-fi.com/cubegamerdev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFDD00] hover:bg-[#FFDD00]/80 text-black text-xs font-semibold cursor-pointer transition-colors"
          >
            <Heart className="w-3.5 h-3.5" />
            Support RiceHub
          </a>
          <span>For the r/unixporn community</span>
        </div>
      </footer>
    </>
  );
}
