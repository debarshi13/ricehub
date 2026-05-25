"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Upload, Terminal, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/lib/supabase/use-auth";

export function Navbar({
  search,
  onSearchChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
}) {
  const { user, loading, signInWithGitHub, signOut } = useAuth();

  return (
    <nav className="fixed top-4 left-4 right-4 z-50 glass-strong rounded-2xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Terminal className="w-6 h-6 text-primary" />
          <span className="font-heading font-bold text-lg tracking-tight">
            RiceHub
          </span>
        </Link>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search rices..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-white/5 border-white/10 focus:border-primary/50 h-10"
          />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <>
              <Link href="/upload">
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/80 cursor-pointer gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </Button>
              </Link>
              <Link href={`/profile/${user.id}`}>
                <Avatar className="w-8 h-8 cursor-pointer ring-2 ring-transparent hover:ring-primary/50 transition-all">
                  <AvatarImage
                    src={user.user_metadata?.avatar_url}
                    alt={user.user_metadata?.user_name}
                  />
                  <AvatarFallback className="bg-secondary text-xs">
                    {(user.user_metadata?.user_name ?? "U")[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              onClick={signInWithGitHub}
              className="cursor-pointer gap-2 glass hover:bg-white/10"
              variant="outline"
            >
              <LogIn className="w-4 h-4" />
              Sign in with GitHub
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
