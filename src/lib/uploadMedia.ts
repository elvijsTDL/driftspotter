import type { SupabaseClient } from "@supabase/supabase-js";

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export function validateImage(file: File): string | null {
  if (!file.type.startsWith("image/")) return "Please select an image file";
  if (file.size > MAX_IMAGE_SIZE) return "Image must be under 5MB";
  return null;
}

/**
 * Uploads an image to a public bucket under the user's folder
 * (storage RLS requires paths to start with the user's id) and
 * returns its public URL.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function uploadImage(
  supabase: SupabaseClient<any>,
  bucket: "event-images" | "profile-media",
  userId: string,
  file: File
): Promise<{ url: string | null; error: string | null }> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { contentType: file.type });

  if (error) return { url: null, error: error.message };

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}

export async function uploadImages(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any>,
  bucket: "event-images" | "profile-media",
  userId: string,
  files: File[]
): Promise<{ urls: string[]; error: string | null }> {
  const urls: string[] = [];
  for (const file of files) {
    const { url, error } = await uploadImage(supabase, bucket, userId, file);
    if (error) return { urls, error };
    if (url) urls.push(url);
  }
  return { urls, error: null };
}
