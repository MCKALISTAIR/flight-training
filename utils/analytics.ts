/**
 * Looking Glass Analytics — React Native / Expo SDK
 *
 * Drop this file into your project and call:
 *   Analytics.init('YOUR_TRACKING_ID')
 *
 * Then use:
 *   Analytics.trackScreenView('ScreenName')
 *   Analytics.trackEvent('event_name', { key: 'value' })
 *
 * Or use the useAnalyticsNavigator() hook in your root _layout.tsx
 * to automatically track all Expo Router screen changes.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Types ──────────────────────────────────────────────────────────────────

type EventProperties = Record<string, string | number | boolean | null>;

interface PageviewPayload {
  tracking_id: string;
  type: 'pageview';
  data: {
    session_id: string;
    visitor_id: string;
    path: string;
    referrer: null;
    utm_source: null;
    utm_medium: null;
    utm_campaign: null;
    utm_term: null;
    utm_content: null;
    user_agent: string;
    device_type: 'Mobile' | 'Tablet' | 'Desktop';
    browser: string;
    os: string;
    screen_width: number;
    screen_height: number;
  };
}

interface PageleavePayload {
  tracking_id: string;
  type: 'pageleave';
  data: {
    session_id: string;
    visitor_id: string;
    path: string;
    duration_ms: number;
    is_bounce: boolean;
  };
}

interface EventPayload {
  tracking_id: string;
  type: 'event';
  data: {
    session_id: string;
    visitor_id: string;
    name: string;
    properties: EventProperties;
    path: string;
  };
}

// ── Storage keys ──────────────────────────────────────────────────────────────

const VISITOR_KEY = '_lg_vid';
const SESSION_KEY = '_lg_sid';

// ── Internal state ────────────────────────────────────────────────────────────

let _trackingId = '';
let _endpoint = '';
let _vid = '';
let _sid = '';
let _currentScreen = '';
let _screenStart = 0;
let _hasInteracted = false;
let _initialized = false;

// ── Helpers ───────────────────────────────────────────────────────────────────

function rnd(): string {
  return Math.random().toString(36).substring(2, 11);
}

function getProjectId(trackingId: string): string {
  // Extract Supabase project ref from tracking ID prefix or use env variable
  // By convention: SUPABASE_PROJECT_REF is stored as the first segment of tracking IDs
  // The endpoint is set explicitly in init()
  return trackingId;
}

async function send(payload: PageviewPayload | PageleavePayload | EventPayload): Promise<void> {
  if (!_endpoint) return;
  try {
    await fetch(_endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    // Silently fail — analytics should never crash the app
    if (__DEV__) {
      console.warn('[LG Analytics] send failed:', e);
    }
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

const Analytics = {
  /**
   * Must be called once at app startup (e.g., in _layout.tsx useEffect).
   * @param trackingId  The tracking ID from your Looking Glass dashboard
   * @param endpoint    The full URL to your Edge Function (defaults to the public Supabase instance)
   */
  async init(
    trackingId: string,
    endpoint = 'https://qncktpkapwrfsioqeofr.supabase.co/functions/v1/track'
  ): Promise<void> {
    if (_initialized) return;
    _trackingId = trackingId;
    _endpoint = endpoint;

    // Restore or generate visitor ID (persists across app installs until cleared)
    const storedVid = await AsyncStorage.getItem(VISITOR_KEY);
    _vid = storedVid ?? rnd();
    if (!storedVid) await AsyncStorage.setItem(VISITOR_KEY, _vid);

    // Session ID: new each time the app is freshly launched
    // We use a key that we reset on every cold start by not persisting it
    _sid = rnd();

    _initialized = true;
    if (__DEV__) {
      console.log('[LG Analytics] init — vid:', _vid, 'sid:', _sid);
    }
  },

  /**
   * Track a screen view. Call this whenever React Navigation / Expo Router
   * changes the active screen.
   */
  trackScreenView(screenName: string, props?: EventProperties): void {
    if (!_initialized) return;

    // Fire pageleave for the previous screen if applicable
    if (_currentScreen) {
      const duration = Date.now() - _screenStart;
      void send({
        tracking_id: _trackingId,
        type: 'pageleave',
        data: {
          session_id: _sid,
          visitor_id: _vid,
          path: _currentScreen,
          duration_ms: duration,
          is_bounce: !_hasInteracted,
        },
      });
    }

    // Reset for the new screen
    _currentScreen = `/${screenName}`;
    _screenStart = Date.now();
    _hasInteracted = false;

    void send({
      tracking_id: _trackingId,
      type: 'pageview',
      data: {
        session_id: _sid,
        visitor_id: _vid,
        path: _currentScreen,
        referrer: null,
        utm_source: null,
        utm_medium: null,
        utm_campaign: null,
        utm_term: null,
        utm_content: null,
        user_agent: `ReactNative/${_trackingId}`,
        device_type: 'Mobile',
        browser: 'Expo',
        os: 'iOS', // overridden at runtime by Platform if desired
        screen_width: 0,
        screen_height: 0,
        ...props,
      } as PageviewPayload['data'],
    });

    if (__DEV__) {
      console.log('[LG Analytics] screenView:', screenName);
    }
  },

  /**
   * Track a custom event. Call this on button taps, form submissions, etc.
   */
  trackEvent(name: string, props?: EventProperties): void {
    if (!_initialized) return;
    _hasInteracted = true;

    void send({
      tracking_id: _trackingId,
      type: 'event',
      data: {
        session_id: _sid,
        visitor_id: _vid,
        name,
        properties: props ?? {},
        path: _currentScreen,
      },
    });

    if (__DEV__) {
      console.log('[LG Analytics] event:', name, props);
    }
  },

  /** Mark that the user has interacted on the current screen (affects is_bounce). */
  markInteraction(): void {
    _hasInteracted = true;
  },
};

export default Analytics;
