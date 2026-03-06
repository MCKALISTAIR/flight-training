import { useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppStore } from '@/store/useAppStore';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();

  const hasSeenOnboarding = useAppStore((state) => state.hasSeenOnboarding);
  const storeHydrated = useAppStore.persist.hasHydrated();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for Zustand to hydrate from AsyncStorage
    if (storeHydrated) setIsReady(true);
  }, [storeHydrated]);

  useEffect(() => {
    if (!isReady) return;

    const inTabsGroup = segments[0] === '(tabs)';

    if (!hasSeenOnboarding && inTabsGroup) {
      // Redirect to onboarding if they haven't completed it
      router.replace('/onboarding');
    } else if (hasSeenOnboarding && !inTabsGroup) {
      // Redirect to tabs if they have completed it and are stuck on onboarding
      router.replace('/(tabs)');
    }
  }, [hasSeenOnboarding, segments, isReady]);

  if (!isReady) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="onboarding" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="add-flight" options={{ presentation: 'modal', title: 'Log a Flight' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
