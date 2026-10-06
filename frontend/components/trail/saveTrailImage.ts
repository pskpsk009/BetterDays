import { supabase } from "@/lib/supabase";

const TRAIL_BUCKET = "public-trails";

export async function uploadTrailImage(
  source: string,
  metadata: { mode: "indoor" | "outdoor"; distanceMeters: number },
) {
  let {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const anonymous = await supabase.auth.signInAnonymously();
    if (anonymous.error || !anonymous.data.user) {
      throw (
        anonymous.error ?? new Error("Supabase authentication is required.")
      );
    }
    user = anonymous.data.user;
  }

  const isSvg = source.trimStart().startsWith("<svg");
  const file = isSvg
    ? new Blob([source], { type: "image/svg+xml" })
    : await (await fetch(source)).arrayBuffer();
  const extension = isSvg ? "svg" : "jpg";
  const contentType = isSvg ? "image/svg+xml" : "image/jpeg";
  const path = `${user.id}/${Date.now()}.${extension}`;
  const upload = await supabase.storage.from(TRAIL_BUCKET).upload(path, file, {
    contentType,
    cacheControl: "3600",
    upsert: false,
  });

  if (upload.error) throw upload.error;
  const record = await supabase
    .from("public_trails")
    .insert({
      user_id: user.id,
      image_path: path,
      mode: metadata.mode,
      distance_m: metadata.distanceMeters,
    })
    .select("id")
    .single();

  if (record.error) throw record.error;
  return { path, userId: user.id, trailId: record.data.id };
}
