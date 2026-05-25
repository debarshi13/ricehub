import { Suspense } from "react";
import { HomeClient } from "@/components/home-client";
import { RiceBowl } from "@/components/rice-illustration";
import { getServerRices } from "@/lib/supabase/server-queries";
import { Upload, ArrowDown, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "RiceHub — Share & Browse Linux Desktop Rices",
  description:
    "Browse, share, and download Linux desktop configurations (rices). Hyprland, i3, sway, bspwm, KDE, GNOME and more. The home for r/unixporn.",
  keywords: [
    "linux rice",
    "linux ricing",
    "unixporn",
    "linux desktop",
    "dotfiles",
    "hyprland",
    "i3wm",
    "sway",
    "bspwm",
    "linux customization",
    "desktop customization",
    "window manager",
    "linux themes",
    "rice sharing",
  ],
  openGraph: {
    title: "RiceHub — Where rices find a home",
    description:
      "Browse, share, and download Linux desktop rices. Hyprland, i3, sway, bspwm, and more.",
    url: "https://ricehub.fun",
    siteName: "RiceHub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RiceHub — Where rices find a home",
    description:
      "Browse, share, and download Linux desktop rices.",
  },
  alternates: {
    canonical: "https://ricehub.fun",
  },
};

async function RiceBrowse() {
  let rices: Awaited<ReturnType<typeof getServerRices>> = [];
  try {
    rices = await getServerRices();
  } catch {
    rices = [];
  }
  return <HomeClient rices={rices} />;
}

export default function Home() {
  return (
    <>
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 pt-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-purple-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-4xl mx-auto flex flex-col items-center text-center space-y-6">
          <RiceBowl className="w-40 h-40 md:w-52 md:h-52 drop-shadow-2xl" />

          <div className="space-y-4">
            <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              Where rices
              <br />
              find a <span className="text-primary">home</span>
              <span className="text-muted-foreground">.</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Just click share!
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

      <Suspense
        fallback={
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        }
      >
        <RiceBrowse />
      </Suspense>

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
