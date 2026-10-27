import { supabase } from "../../../src/lib/supabase";
import { applyRemote, changedAt, readRaw, STORE_KEYS, StoreKey } from "../common/localStore";

// Account backup for on-device saved data (see backend/supabase/backup.sql).
// One row per saved feature; each sync keeps whichever copy changed last.
// The database only accepts writes from signed-in users with backup consent.

/** Bump when the backup consent wording in Profile changes. */
export const BACKUP_CONSENT_VERSION = 1;

type Row = { key: StoreKey; value: unknown; updated_at: string };

export async function hasBackupConsent(): Promise<boolean> {
  const { data, error } = await supabase
    .from("consents")
    .select("id")
    .eq("purpose", "backup")
    .is("withdrawn_at", null)
    .limit(1);
  if (error) throw error;
  return data.length > 0;
}

export async function giveBackupConsent() {
  const { error } = await supabase.from("consents").insert({ purpose: "backup", version: BACKUP_CONSENT_VERSION });
  if (error) throw error;
}

/** Withdraws consent; the database then deletes the backup copy. */
export async function withdrawBackupConsent() {
  const { error } = await supabase
    .from("consents")
    .update({ withdrawn_at: new Date().toISOString() })
    .eq("purpose", "backup")
    .is("withdrawn_at", null);
  if (error) throw error;
}

async function upload(userId: string, key: StoreKey, value: unknown, at: number) {
  const { error } = await supabase
    .from("user_data")
    .upsert({ user_id: userId, key, value, updated_at: new Date(at).toISOString() });
  if (error) throw error;
}

async function removeRemote(userId: string, key: StoreKey) {
  const { error } = await supabase.from("user_data").delete().eq("user_id", userId).eq("key", key);
  if (error) throw error;
}

/** Sends one key's current value (or its deletion) to the backup. */
export async function pushKey(userId: string, key: StoreKey) {
  const value = readRaw(key);
  if (value === null) await removeRemote(userId, key);
  else await upload(userId, key, value, changedAt(key) || Date.now());
}

/** Two-way sync of every key: newer copy wins, per key. */
export async function syncAll(userId: string) {
  const { data, error } = await supabase.from("user_data").select("key, value, updated_at");
  if (error) throw error;
  const remote = new Map((data as Row[]).map((row) => [row.key, row]));

  for (const key of STORE_KEYS) {
    const row = remote.get(key);
    const remoteAt = row ? Date.parse(row.updated_at) : 0;
    const localAt = changedAt(key);
    const local = readRaw(key);

    if (row && remoteAt > localAt) {
      applyRemote(key, row.value, remoteAt);
    } else if (local !== null && (!row || localAt > remoteAt)) {
      // Saved before timestamps existed counts as "now", so it gets backed up.
      await upload(userId, key, local, localAt || Date.now());
    } else if (local === null && row && localAt > remoteAt) {
      await removeRemote(userId, key);
    }
  }
}

/** Deletes the whole backup copy (used by Delete all data). */
export async function deleteBackup(userId: string) {
  const { error } = await supabase.from("user_data").delete().eq("user_id", userId);
  if (error) throw error;
}

/** Records an export or deletion for the audit log (LR6). Failures are ignored. */
export async function logEvent(userId: string, action: "export" | "data_deleted") {
  await supabase.from("audit_events").insert({ user_id: userId, action });
}
