// Web fallback for on-device storage: the browser's localStorage, so the web
// build needs no SQLite setup. Native platforms use storage.native.ts.

export function readItem(key: string): string | null {
  return globalThis.localStorage?.getItem(key) ?? null;
}

export function writeItem(key: string, value: string) {
  globalThis.localStorage?.setItem(key, value);
}

export function removeItem(key: string) {
  globalThis.localStorage?.removeItem(key);
}
