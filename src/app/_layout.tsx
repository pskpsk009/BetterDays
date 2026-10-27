import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { AuthProvider } from '../../frontend/components/auth/AuthProvider';
import { BackupProvider } from '../../frontend/components/sync/BackupProvider';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <BackupProvider>
          <AnimatedSplashOverlay />
          <AppTabs />
        </BackupProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
