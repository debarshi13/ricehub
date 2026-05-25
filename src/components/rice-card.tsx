"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Download, Heart } from "lucide-react";
import type { Rice } from "@/lib/mock-data";

export function RiceCard({ rice }: { rice: Rice }) {
  return (
    <Link href={`/rice/${rice.id}`} className="group cursor-pointer">
      <div className="glass rounded-xl overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(220,20,60,0.08)]">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={rice.screenshots[0]}
            alt={rice.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <Badge
              variant="secondary"
              className="bg-black/60 backdrop-blur-sm text-xs font-mono"
            >
              {rice.wm}
            </Badge>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-heading font-semibold text-sm group-hover:text-primary transition-colors duration-200">
              {rice.title}
            </h3>
            <p className="text-muted-foreground text-xs mt-0.5">
              by {rice.author} &middot; {rice.distro}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {rice.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-[10px] px-2 py-0 border-white/10 text-muted-foreground"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-white/5">
            <span className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              {rice.downloads.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {rice.tips} tips
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
