import Storage from "expo-sqlite/kv-store";

// On-device key-value storage for iOS and Android. Data never leaves the phone.

export function readItem(key: string): string | null {
  return Storage.getItemSync(key);
}

export function writeItem(key: string, value: string) {
  Storage.setItemSync(key, value);
}

export function removeItem(key: string) {
  Storage.removeItemSync(key);
}
