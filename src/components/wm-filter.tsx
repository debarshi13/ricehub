"use client";

import { WM_OPTIONS } from "@/lib/mock-data";

export function WmFilter({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (wm: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {WM_OPTIONS.map((wm) => (
        <button
          key={wm}
          onClick={() => onSelect(wm)}
          className={`px-4 py-1.5 rounded-lg text-sm font-mono cursor-pointer transition-all duration-200 ${
            selected === wm
              ? "bg-primary text-primary-foreground"
              : "glass text-muted-foreground hover:text-foreground hover:border-white/20"
          }`}
        >
          {wm}
        </button>
      ))}
    </div>
  );
}
