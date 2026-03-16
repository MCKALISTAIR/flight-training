/**
 * Looking Glass Analytics — useAnalyticsNavigator hook for Expo Router
 *
 * Usage in your root _layout.tsx:
 *
 *   import { useAnalyticsNavigator } from '@/utils/useAnalyticsNavigator';
 *
 *   export default function RootLayout() {
 *     useAnalyticsNavigator();   // ← add this line
 *     ...
 *   }
 */

import { useEffect, useRef } from 'react';
import { useSegments, usePathname } from 'expo-router';
import Analytics from './analytics';

/**
 * Watches Expo Router's active path and fires a screenView event on every change.
 * Mount once in your root _layout.tsx — no other configuration needed.
 */
export function useAnalyticsNavigator(): void {
  const segments = useSegments();
  const pathname = usePathname();
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    // Derive a clean screen name from the Expo Router path
    // e.g. ["(tabs)", "index"] → "(tabs)/index"
    const screenName = segments.join('/') || 'index';

    // Only fire when the path actually changes
    if (pathname !== previousPath.current) {
      previousPath.current = pathname;
      Analytics.trackScreenView(screenName);
    }
  }, [pathname, segments]);
}
