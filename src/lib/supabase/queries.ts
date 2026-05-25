import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

type Client = SupabaseClient<Database>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRice = any;

export async function getRices(
  client: Client,
  opts?: { wm?: string; search?: string }
) {
  let query = client
    .from("rices")
    .select(
      `
      *,
      profiles (*),
      screenshots (*),
      tips (id)
    `
    )
    .order("created_at", { ascending: false });

  if (opts?.wm && opts.wm !== "All") {
    query = query.eq("wm", opts.wm);
  }

  if (opts?.search) {
    query = query.or(
      `title.ilike.%${opts.search}%,description.ilike.%${opts.search}%`
    );
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((rice: AnyRice) => ({
    ...rice,
    tip_count: rice.tips?.length ?? 0,
  }));
}

export async function getRiceById(client: Client, id: string) {
  const { data, error } = await client
    .from("rices")
    .select(
      `
      *,
      profiles (*),
      screenshots (*),
      tips (id)
    `
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  const rice = data as AnyRice;

  return {
    ...rice,
    tip_count: rice.tips?.length ?? 0,
  };
}

export async function createRice(
  client: Client,
  rice: Database["public"]["Tables"]["rices"]["Insert"]
): Promise<Database["public"]["Tables"]["rices"]["Row"]> {
  const { data, error } = await (client
    .from("rices") as AnyRice)
    .insert(rice)
    .select()
    .single();

  if (error) throw error;
  return data!;
}

export async function addScreenshot(
  client: Client,
  riceId: string,
  storagePath: string,
  order: number
) {
  const { error } = await (client
    .from("screenshots") as AnyRice)
    .insert({ rice_id: riceId, storage_path: storagePath, display_order: order });

  if (error) throw error;
}

export async function uploadScreenshot(
  client: Client,
  file: File,
  riceId: string,
  index: number
) {
  const ext = file.name.split(".").pop();
  const path = `${riceId}/${index}.${ext}`;

  const { error } = await client.storage
    .from("screenshots")
    .upload(path, file, { upsert: true });

  if (error) throw error;
  return path;
}

export async function getScreenshotUrl(client: Client, path: string) {
  const {
    data: { publicUrl },
  } = client.storage.from("screenshots").getPublicUrl(path);

  return publicUrl;
}

export async function sendTip(
  client: Client,
  riceId: string,
  tipperId: string,
  message?: string
) {
  const { error } = await (client
    .from("tips") as AnyRice)
    .insert({ rice_id: riceId, tipper_id: tipperId, message });

  if (error) throw error;
}

export async function getProfile(client: Client, userId: string) {
  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}

export async function getRicesByUser(client: Client, userId: string) {
  const { data, error } = await client
    .from("rices")
    .select(
      `
      *,
      profiles (*),
      screenshots (*),
      tips (id)
    `
    )
    .eq("author_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((rice: AnyRice) => ({
    ...rice,
    tip_count: rice.tips?.length ?? 0,
  }));
}
