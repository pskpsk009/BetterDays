import { Share } from "react-native";

import { supabase } from "../../../src/lib/supabase";
import { clearAllSaved, readRaw, STORE_KEYS } from "../common/localStore";
import { deleteBackup, logEvent } from "../sync/cloudSync";
import { TRAIL_BUCKET } from "../trail/saveTrailImage";

const OFFLINE =
  "Everything on this phone is deleted, but we couldn't reach the server to finish. Check your connection and try again.";

/**
 * Deletes everything MyGrowth keeps for this person: all on-device data, the
 * account backup copy, and any trails they shared (images and gallery rows)
 * under the current session. The account itself (email and password) stays.
 */
export async function deleteAllData(): Promise<{ error: string | null }> {
  clearAllSaved();

  const { data } = await supabase.auth.getSession();
  // Includes anonymous sessions, which is how Trail sharing works without an account.
  const user = data.session?.user;
  if (!user) return { error: null };

  try {
    const bucket = supabase.storage.from(TRAIL_BUCKET);
    const listed = await bucket.list(user.id, { limit: 1000 });
    if (listed.error) throw listed.error;
    if (listed.data.length > 0) {
      const removed = await bucket.remove(listed.data.map((file) => `${user.id}/${file.name}`));
      if (removed.error) throw removed.error;
    }
    const rows = await supabase.from("public_trails").delete().eq("user_id", user.id);
    if (rows.error) throw rows.error;
    if (!user.is_anonymous) {
      await deleteBackup(user.id);
      await logEvent(user.id, "data_deleted");
    }
  } catch {
    return { error: OFFLINE };
  }
  return { error: null };
}

/** Deletes all data (as above), then the account itself. Signs out afterwards. */
export async function deleteAccount(): Promise<{ error: string | null }> {
  const cleared = await deleteAllData();
  if (cleared.error) return cleared;
  const { error } = await supabase.rpc("delete_my_account");
  if (error) return { error: OFFLINE };
  // The account is gone, so just forget the session on this device.
  await supabase.auth.signOut({ scope: "local" });
  return { error: null };
}

/** Shares a JSON copy of everything saved on this device (LR3 export). */
export async function exportData(email: string | null, userId: string | null): Promise<{ error: string | null }> {
  const saved = Object.fromEntries(STORE_KEYS.map((key) => [key, readRaw(key)]));
  const copy = { app: "MyGrowth", exportedAt: new Date().toISOString(), account: email, saved };
  try {
    await Share.share({ title: "My MyGrowth data", message: JSON.stringify(copy, null, 2) });
  } catch {
    return { error: "Sharing isn't available here. Try on your phone." };
  }
  if (userId) logEvent(userId, "export").catch(() => {});
  return { error: null };
}
