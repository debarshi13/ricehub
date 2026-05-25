"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getRiceById, getScreenshotUrl } from "@/lib/supabase/queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Coffee,
  Download,
  ExternalLink,
  Heart,
  ChevronLeft,
  ChevronRight,
  Terminal,
} from "lucide-react";

type RiceData = {
  id: string;
  title: string;
  description: string;
  wm: string;
  distro: string;
  tags: string[];
  dots_url: string | null;
  downloads: number;
  created_at: string;
  author_name: string;
  author_id: string;
  author_bmac: string | null;
  screenshots: string[];
  tip_count: number;
};

export default function RiceDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [rice, setRice] = useState<RiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentScreenshot, setCurrentScreenshot] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const data = await getRiceById(supabase, id);

        const screenshots = await Promise.all(
          (data.screenshots ?? [])
            .sort(
              (a: { display_order: number }, b: { display_order: number }) =>
                a.display_order - b.display_order
            )
            .map((s: { storage_path: string }) =>
              getScreenshotUrl(supabase, s.storage_path)
            )
        );

        setRice({
          id: data.id,
          title: data.title,
          description: data.description,
          wm: data.wm,
          distro: data.distro,
          tags: data.tags,
          dots_url: data.dots_url,
          downloads: data.downloads,
          created_at: data.created_at.split("T")[0],
          author_name: data.profiles?.username ?? "unknown",
          author_id: data.author_id,
          author_bmac: data.profiles?.buymeacoffee ?? null,
          screenshots:
            screenshots.length > 0
              ? screenshots
              : [
                  `https://placehold.co/1920x1080/1a1520/f8fafc?text=${encodeURIComponent(data.title)}`,
                ],
          tip_count: data.tip_count,
        });
      } catch {
        // Not found
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  function openBmac() {
    if (!rice?.author_bmac) return;
    window.open(`https://ko-fi.com/${rice.author_bmac}`, "_blank");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!rice) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="font-mono text-2xl">404</p>
          <p className="text-muted-foreground">Rice not found</p>
          <Link href="/" className="text-primary hover:underline text-sm">
            Back to browse
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <nav className="fixed top-4 left-4 right-4 z-50 glass-strong rounded-2xl">
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
          {rice?.author_bmac && (
            <Button
              onClick={openBmac}
              className="cursor-pointer gap-2 bg-success hover:bg-success/80"
            >
              <Coffee className="w-4 h-4" />
              Tip creator
            </Button>
          )}
        </div>
      </nav>

      <div className="pt-28 pb-24 px-6">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="relative aspect-video rounded-xl overflow-hidden glass">
            <Image
              src={rice.screenshots[currentScreenshot]}
              alt={`${rice.title} screenshot ${currentScreenshot + 1}`}
              fill
              className="object-cover"
              priority
              unoptimized
            />
            {rice.screenshots.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentScreenshot(
                      (p) =>
                        (p - 1 + rice.screenshots.length) %
                        rice.screenshots.length
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() =>
                    setCurrentScreenshot(
                      (p) => (p + 1) % rice.screenshots.length
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {rice.screenshots.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentScreenshot(i)}
                      className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${
                        i === currentScreenshot ? "bg-white" : "bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-2">
                <h1 className="font-heading text-3xl font-bold">
                  {rice.title}
                </h1>
                <p className="text-muted-foreground">
                  by{" "}
                  <Link
                    href={`/profile/${rice.author_id}`}
                    className="text-foreground font-medium hover:text-primary transition-colors cursor-pointer"
                  >
                    {rice.author_name}
                  </Link>{" "}
                  &middot; {rice.distro} &middot; {rice.created_at}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge className="bg-primary/20 text-primary border-primary/30 font-mono">
                  {rice.wm}
                </Badge>
                {rice.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="border-white/10 text-muted-foreground"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              {rice.description && (
                <div className="glass rounded-xl p-6 space-y-3">
                  <h2 className="font-heading font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                    Description
                  </h2>
                  <p className="text-foreground/90 leading-relaxed">
                    {rice.description}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="glass rounded-xl p-6 space-y-4">
                <h2 className="font-heading font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                  Stats
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Download className="w-4 h-4" />
                      Downloads
                    </span>
                    <span className="font-mono text-sm">
                      {rice.downloads.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Heart className="w-4 h-4" />
                      Tips received
                    </span>
                    <span className="font-mono text-sm">{rice.tip_count}</span>
                  </div>
                </div>
              </div>

              {rice.dots_url && (
                <a
                  href={rice.dots_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass rounded-xl p-6 flex items-center justify-between cursor-pointer hover:border-primary/30 transition-colors block"
                >
                  <div className="space-y-1">
                    <p className="font-heading font-semibold text-sm">
                      Dotfiles
                    </p>
                    <p className="text-xs text-muted-foreground">
                      View on GitHub
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </a>
              )}

              {rice.author_bmac && (
                <Button
                  onClick={openBmac}
                  className="w-full cursor-pointer gap-2 h-12 text-base bg-[#FFDD00] hover:bg-[#FFDD00]/80 text-black font-semibold"
                  size="lg"
                >
                  <Coffee className="w-5 h-5" />
                  Support on Ko-fi
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
