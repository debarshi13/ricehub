"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RiceBowl } from "@/components/rice-illustration";
import { useAuth } from "@/lib/supabase/use-auth";
import { createClient } from "@/lib/supabase/client";
import { getProfile } from "@/lib/supabase/queries";
import { useScrollOpacity } from "@/components/navbar";
import { ArrowLeft, Terminal, Save, LogIn, Coffee } from "lucide-react";

export default function SettingsPage() {
  const { user, loading: authLoading, signInWithGitHub } = useAuth();
  const navOpacity = useScrollOpacity();

  const [bio, setBio] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [bmac, setBmac] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function load() {
      const supabase = createClient();
      try {
        const profile = await getProfile(supabase, user!.id);
        setBio(profile.bio ?? "");
        setGithubUrl(profile.github_url ?? "");
        setBmac(profile.buymeacoffee ?? "");
      } catch {
        // New user, no profile yet
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    setSaved(false);
    try {
      const supabase = createClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from("profiles") as any)
        .update({
          bio: bio || null,
          github_url: githubUrl || null,
          buymeacoffee: bmac || null,
        })
        .eq("id", user.id);

      if (error) throw error;
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // Save failed
    } finally {
      setSaving(false);
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center space-y-6">
          <RiceBowl className="w-28 h-28 mx-auto opacity-60" />
          <div className="space-y-2">
            <h1 className="font-heading text-2xl font-bold">
              Sign in to edit your profile
            </h1>
            <p className="text-muted-foreground text-sm max-w-sm">
              Connect your GitHub account to customize your creator profile.
            </p>
          </div>
          <Button
            onClick={signInWithGitHub}
            className="cursor-pointer gap-2"
            size="lg"
          >
            <LogIn className="w-4 h-4" />
            Sign in with GitHub
          </Button>
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
        <div className="max-w-lg mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="font-heading text-3xl font-bold">
              Profile settings
            </h1>
            <p className="text-muted-foreground">
              Customize your creator profile.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell people about yourself..."
                  rows={3}
                  className="w-full rounded-lg bg-white/5 border border-white/10 focus:border-primary/50 px-3 py-2 text-sm outline-none resize-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">GitHub URL</label>
                <Input
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/yourusername"
                  className="bg-white/5 border-white/10 focus:border-primary/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-[#FFDD00]" />
                  Ko-fi username
                </label>
                <div className="flex items-center gap-0">
                  <span className="h-9 px-3 flex items-center text-sm text-muted-foreground bg-white/5 border border-r-0 border-white/10 rounded-l-lg">
                    ko-fi.com/
                  </span>
                  <Input
                    value={bmac}
                    onChange={(e) => setBmac(e.target.value)}
                    placeholder="yourusername"
                    className="bg-white/5 border-white/10 focus:border-primary/50 rounded-l-none"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Visitors can tip you directly through Ko-fi.
                  {" "}
                  <a
                    href="https://ko-fi.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Create an account
                  </a>
                </p>
              </div>

              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full cursor-pointer gap-2 h-11 bg-primary hover:bg-primary/80"
              >
                {saving ? (
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : saved ? (
                  "Saved!"
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save profile
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
