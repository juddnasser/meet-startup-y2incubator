/**
 * platform.js
 * Cross-platform utilities that smooth over Android / iOS differences.
 *
 * AsyncStorage v3 handles its own SQLite platform differences internally.
 * The only thing the application layer needs to handle explicitly is UUID
 * generation — crypto.randomUUID() is not available on older Android JSC
 * engines (React Native < 0.70 without Hermes).
 *
 * Resolution order for generateId():
 *   1. expo-crypto      works on all Expo-supported Android and iOS versions
 *   2. crypto.randomUUID()  available on Hermes / RN 0.70+, and all iOS
 *   3. Math.random() polyfill  last resort for very old Android JSC
 *
 * Install expo-crypto with:
 *   npx expo install expo-crypto
 */

import { Platform } from 'react-native';

// Lazily resolved — set once on first call to generateId(), reused after.
let _cachedGenerator = null;

/**
 * Resolves the best available UUID generator for the current platform.
 *
 * @returns {Promise<() => string>}
 */
async function resolveGenerator() {
  if (_cachedGenerator !== null) return _cachedGenerator;

  // 1. expo-crypto — preferred, guaranteed cross-platform
  try {
    const expoCrypto = await import('expo-crypto');
    _cachedGenerator = expoCrypto.randomUUID;
    return _cachedGenerator;
  } catch {
    // expo-crypto not installed — continue to next option
  }

  // 2. Native crypto.randomUUID — available on Hermes and all modern iOS
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    _cachedGenerator = () => crypto.randomUUID();
    return _cachedGenerator;
  }

  // 3. Math.random() polyfill — last resort for very old Android JSC environments
  _cachedGenerator = () =>
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });

  return _cachedGenerator;
}

/**
 * Generates a UUID string.
 * Safe on all Android and iOS versions supported by Expo.
 *
 * @returns {Promise<string>}
 */
export async function generateId() {
  const fn = await resolveGenerator();
  return fn();
}

/** True when running on Android. */
export const isAndroid = Platform.OS === 'android';

/** True when running on iOS. */
export const isIOS = Platform.OS === 'ios';

/**
 * Returns a human-readable platform label for debug logging.
 * e.g. "android 14" or "ios 17.4"
 *
 * @returns {string}
 */
export function platformLabel() {
  return `${Platform.OS} ${Platform.Version}`;
}
