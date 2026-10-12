import { useSyncExternalStore } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

// useSyncExternalStore returns the server snapshot until hydration, then the client snapshot.
// This lets us safely return 'light' on the server and the real color scheme on the client
// without calling setState inside an effect.
const noop = () => () => {};

export function useColorScheme() {
  const colorScheme = useRNColorScheme();
  const isHydrated = useSyncExternalStore(noop, () => true, () => false);
  return isHydrated ? colorScheme : 'light';
}
