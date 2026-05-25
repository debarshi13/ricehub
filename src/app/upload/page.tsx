"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RiceBowl } from "@/components/rice-illustration";
import { useAuth } from "@/lib/supabase/use-auth";
import { useScrollOpacity } from "@/components/navbar";
import { createClient } from "@/lib/supabase/client";
import { createRice, uploadScreenshot, addScreenshot, getProfile } from "@/lib/supabase/queries";
import {
  ArrowLeft,
  Upload,
  ImagePlus,
  X,
  Terminal,
  LogIn,
  Coffee,
} from "lucide-react";
import { WM_OPTIONS } from "@/lib/mock-data";

export default function UploadPage() {
  const { user, loading, signInWithGitHub } = useAuth();
  const router = useRouter();
  const navOpacity = useScrollOpacity();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [wm, setWm] = useState("");
  const [distro, setDistro] = useState("");
  const [dotsUrl, setDotsUrl] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [kofi, setKofi] = useState("");
  const [kofiLoaded, setKofiLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    getProfile(supabase, user.id).then((p) => {
      setKofi(p.buymeacoffee ?? "");
      setKofiLoaded(true);
    }).catch(() => setKofiLoaded(true));
  }, [user]);

  function addTag() {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag) && tags.length < 8) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  function handleFiles(newFiles: FileList | null) {
    if (!newFiles) return;
    const added = Array.from(newFiles).slice(0, 5 - files.length);
    setFiles([...files, ...added]);
    added.forEach((f) => {
      const url = URL.createObjectURL(f);
      setPreviews((p) => [...p, url]);
    });
  }

  function removeFile(index: number) {
    URL.revokeObjectURL(previews[index]);
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    if (!user) return;
    if (!title || !wm || files.length === 0) {
      setError("Title, window manager, and at least one screenshot are required.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const supabase = createClient();

      const rice = await createRice(supabase, {
        author_id: user.id,
        title,
        description,
        wm,
        distro,
        tags,
        dots_url: dotsUrl || null,
      });

      for (let i = 0; i < files.length; i++) {
        const path = await uploadScreenshot(supabase, files[i], rice.id, i);
        await addScreenshot(supabase, rice.id, path, i);
      }

      if (kofi) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from("profiles") as any)
          .update({ buymeacoffee: kofi })
          .eq("id", user.id);
      }

      router.push(`/rice/${rice.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  if (loading) {
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
              Sign in to upload
            </h1>
            <p className="text-muted-foreground text-sm max-w-sm">
              Connect your GitHub account to share your rice with the community.
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
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="font-heading text-3xl font-bold">
              Share your rice
            </h1>
            <p className="text-muted-foreground">
              Upload your desktop configuration for the community.
            </p>
          </div>

          <div className="space-y-6">
            {/* Screenshots */}
            <div className="space-y-3">
              <label className="text-sm font-medium">
                Screenshots <span className="text-primary">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {previews.map((url, i) => (
                  <div
                    key={i}
                    className="relative aspect-video rounded-lg overflow-hidden glass"
                  >
                    <img
                      src={url}
                      alt={`Screenshot ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeFile(i)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center cursor-pointer hover:bg-destructive transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {files.length < 5 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-video rounded-lg border-2 border-dashed border-white/10 hover:border-primary/30 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <ImagePlus className="w-6 h-6" />
                    <span className="text-xs">Add image</span>
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground">
                Up to 5 screenshots. First one is the cover.
              </p>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Title <span className="text-primary">*</span>
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Midnight Catppuccin"
                className="bg-white/5 border-white/10 focus:border-primary/50"
              />
            </div>

            {/* WM */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Window Manager / DE <span className="text-primary">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {WM_OPTIONS.filter((w) => w !== "All").map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setWm(opt)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono cursor-pointer transition-all ${
                      wm === opt
                        ? "bg-primary text-primary-foreground"
                        : "glass text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Distro */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Distro</label>
              <Input
                value={distro}
                onChange={(e) => setDistro(e.target.value)}
                placeholder="e.g. Arch Linux"
                className="bg-white/5 border-white/10 focus:border-primary/50"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What makes this rice special? Tools, themes, configs used..."
                rows={4}
                className="w-full rounded-lg bg-white/5 border border-white/10 focus:border-primary/50 px-3 py-2 text-sm outline-none resize-none transition-colors"
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tags</label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  placeholder="Add a tag..."
                  className="bg-white/5 border-white/10 focus:border-primary/50"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addTag}
                  className="cursor-pointer border-white/10 shrink-0"
                >
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="gap-1 cursor-pointer hover:bg-destructive/20"
                      onClick={() => removeTag(tag)}
                    >
                      {tag}
                      <X className="w-3 h-3" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Dotfiles URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Dotfiles URL</label>
              <Input
                value={dotsUrl}
                onChange={(e) => setDotsUrl(e.target.value)}
                placeholder="https://github.com/you/dotfiles"
                className="bg-white/5 border-white/10 focus:border-primary/50"
              />
            </div>

            {/* Ko-fi */}
            {kofiLoaded && !kofi && (
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
                    value={kofi}
                    onChange={(e) => setKofi(e.target.value)}
                    placeholder="yourusername"
                    className="bg-white/5 border-white/10 focus:border-primary/50 rounded-l-none"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Add your Ko-fi so visitors can tip you directly.
                </p>
              </div>
            )}

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button
              onClick={handleSubmit}
              disabled={submitting}
              size="lg"
              className="w-full cursor-pointer bg-primary hover:bg-primary/80 h-12 text-base gap-2"
            >
              {submitting ? (
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {submitting ? "Uploading..." : "Publish rice"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
