import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

import { useAuth } from "../auth/AuthProvider";
import { onLocalChange, StoreKey } from "../common/localStore";
import { giveBackupConsent, hasBackupConsent, pushKey, syncAll, withdrawBackupConsent } from "./cloudSync";

// Keeps the account backup in step while the user is signed in and has
// turned backup on. Off by default; nothing is sent without consent.

type Status = "off" | "checking" | "syncing" | "on" | "error";

type BackupContextValue = {
  status: Status;
  lastSynced: number | null;
  turnOn: () => Promise<string | null>;
  turnOff: () => Promise<string | null>;
  syncNow: () => Promise<void>;
  /** Uploads any changes still waiting, e.g. before signing out. */
  flush: () => Promise<void>;
};

const BackupContext = createContext<BackupContextValue | null>(null);

export function useBackup() {
  const value = useContext(BackupContext);
  if (!value) throw new Error("useBackup must be used inside BackupProvider");
  return value;
}

/** Wait after a change before uploading, so a burst of taps is one request. */
const PUSH_DELAY_MS = 2000;
/** At most one full check when the app returns to the foreground in this time. */
const RESYNC_MS = 5 * 60 * 1000;

const OFFLINE = "Couldn't reach the server. Check your connection and try again.";

export function BackupProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [enabled, setEnabled] = useState(false);
  const [status, setStatus] = useState<Status>("off");
  const [lastSynced, setLastSynced] = useState<number | null>(null);
  const timers = useRef(new Map<StoreKey, ReturnType<typeof setTimeout>>());

  async function runSync(id: string) {
    setStatus("syncing");
    try {
      await syncAll(id);
      setLastSynced(Date.now());
      setStatus("on");
    } catch {
      setStatus("error");
    }
  }

  // On sign-in: find out whether backup is on, then sync once.
  useEffect(() => {
    setEnabled(false);
    setLastSynced(null);
    if (!userId) {
      setStatus("off");
      return;
    }
    let cancelled = false;
    setStatus("checking");
    hasBackupConsent()
      .then((consented) => {
        if (cancelled) return;
        setEnabled(consented);
        if (consented) runSync(userId);
        else setStatus("off");
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Upload each change shortly after it happens.
  useEffect(() => {
    if (!enabled || !userId) return;
    const pending = timers.current;
    const unsubscribe = onLocalChange((key) => {
      clearTimeout(pending.get(key));
      pending.set(
        key,
        setTimeout(() => {
          pending.delete(key);
          pushKey(userId, key)
            .then(() => {
              setLastSynced(Date.now());
              setStatus("on");
            })
            .catch(() => setStatus("error"));
        }, PUSH_DELAY_MS),
      );
    });
    return () => {
      unsubscribe();
      pending.forEach(clearTimeout);
      pending.clear();
    };
  }, [enabled, userId]);

  // Pick up changes from another device when the app comes back.
  useEffect(() => {
    if (!enabled || !userId) return;
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active" && (!lastSynced || Date.now() - lastSynced > RESYNC_MS)) runSync(userId);
    });
    return () => subscription.remove();
  }, [enabled, userId, lastSynced]);

  const value: BackupContextValue = {
    status,
    lastSynced,
    async turnOn() {
      if (!userId) return "Please sign in first.";
      try {
        await giveBackupConsent();
      } catch {
        return OFFLINE;
      }
      setEnabled(true);
      await runSync(userId);
      return null;
    },
    async turnOff() {
      try {
        await withdrawBackupConsent();
      } catch {
        return OFFLINE;
      }
      setEnabled(false);
      setStatus("off");
      setLastSynced(null);
      return null;
    },
    async syncNow() {
      if (userId && enabled) await runSync(userId);
    },
    async flush() {
      const pending = timers.current;
      if (!userId || pending.size === 0) return;
      const keys = [...pending.keys()];
      pending.forEach(clearTimeout);
      pending.clear();
      await Promise.all(keys.map((key) => pushKey(userId, key).catch(() => setStatus("error"))));
    },
  };

  return <BackupContext.Provider value={value}>{children}</BackupContext.Provider>;
}
