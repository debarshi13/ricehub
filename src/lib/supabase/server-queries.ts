import { createServerSupabase } from "./server";
import { getRices, getRiceById, getScreenshotUrl, getRicesByUser, getProfile } from "./queries";

export type MappedRice = {
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
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function mapRice(supabase: any, r: any): Promise<MappedRice> {
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
    screenshots: screenshots.length > 0
      ? screenshots
      : [`https://placehold.co/1920x1080/1a1520/f8fafc?text=${encodeURIComponent(r.title)}`],
    description: r.description,
    dots: r.dots_url ?? "",
    tips: r.tip_count,
    downloads: r.downloads,
    createdAt: r.created_at.split("T")[0],
  };
}

export async function getServerRices() {
  const supabase = await createServerSupabase();
  const data = await getRices(supabase);
  return Promise.all(data.map((r) => mapRice(supabase, r)));
}

export async function getServerRiceById(id: string) {
  const supabase = await createServerSupabase();
  const data = await getRiceById(supabase, id);

  const screenshots = await Promise.all(
    (data.screenshots ?? [])
      .sort((a: { display_order: number }, b: { display_order: number }) => a.display_order - b.display_order)
      .map((s: { storage_path: string }) => getScreenshotUrl(supabase, s.storage_path))
  );

  return {
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
    screenshots: screenshots.length > 0
      ? screenshots
      : [`https://placehold.co/1920x1080/1a1520/f8fafc?text=${encodeURIComponent(data.title)}`],
    tip_count: data.tip_count,
  };
}

export async function getServerRicesByUser(userId: string) {
  const supabase = await createServerSupabase();
  const data = await getRicesByUser(supabase, userId);
  return Promise.all(data.map((r) => mapRice(supabase, r)));
}

export async function getServerProfile(userId: string) {
  const supabase = await createServerSupabase();
  return getProfile(supabase, userId);
}

export async function getAllRiceIds(): Promise<{ id: string; created_at: string }[]> {
  const supabase = await createServerSupabase();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any).from("rices").select("id, created_at").order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAllProfileIds(): Promise<{ id: string }[]> {
  const supabase = await createServerSupabase();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any).from("profiles").select("id").limit(1000);
  return data ?? [];
}
