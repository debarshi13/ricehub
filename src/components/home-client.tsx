"use client";

import { useState, useMemo } from "react";
import { Navbar } from "@/components/navbar";
import { RiceCard } from "@/components/rice-card";
import { WmFilter } from "@/components/wm-filter";
import { SleepyRiceBowl } from "@/components/rice-illustration";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { MappedRice } from "@/lib/supabase/server-queries";

export function HomeClient({ rices }: { rices: MappedRice[] }) {
  const [search, setSearch] = useState("");
  const [wmFilter, setWmFilter] = useState("All");

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

      <section id="browse" className="px-6 pb-24 pt-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-bold">Browse rices</h2>
            <WmFilter selected={wmFilter} onSelect={setWmFilter} />
          </div>

          {filtered.length === 0 ? (
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
    </>
  );
}
