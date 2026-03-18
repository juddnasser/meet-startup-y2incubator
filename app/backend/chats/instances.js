/**
 * instances.js
 * Provides lazy-initialised AsyncStorage v3 database instances.
 *
 * WHY LAZY?
 * ─────────
 * Calling createAsyncStorage() at the top level of a module causes it to run
 * the moment the file is imported — before the Turbo Native Module bridge has
 * finished initialising. This produces the error:
 *
 *   "createAsyncStorage is not a function"
 *
 * The fix is to defer the call until the first time a storage instance is
 * actually used (i.e. inside an async function, always after the bridge is
 * ready). We use a simple singleton cache so the instance is only created once.
 *
 * DATABASE INSTANCES
 * ──────────────────
 * primaryStorage  ("chat-primary")
 *   Live window — holds the most recent 300 messages per peer.
 *   Key pattern:  "chat:<peerId>"  →  Conversation (JSON)
 *
 * archiveStorage  ("chat-archive")
 *   Archive — holds sealed batches of 300 evicted messages per peer.
 *   Key pattern:  "archive:<peerId>:meta"           →  ArchiveMeta (JSON)
 *                 "archive:<peerId>:batch:<index>"  →  Message[]   (JSON)
 *
 * PLATFORM NOTES
 * ──────────────
 * AsyncStorage v3 uses SQLite on both Android and iOS. All platform
 * differences are handled internally by the library — no platform-specific
 * code is required here.
 */

import { createAsyncStorage } from '@react-native-async-storage/async-storage';

// Singleton cache — populated on first access, reused on every subsequent call.
let _primary = null;
let _archive = null;

/**
 * Returns the primary storage instance, creating it on first call.
 * Safe to call from any async context (always after native bridge is ready).
 *
 * @returns {ReturnType<typeof createAsyncStorage>}
 */
export function getPrimaryStorage() {
  if (_primary === null) {
    _primary = createAsyncStorage('chat-primary');
  }
  return _primary;
}

/**
 * Returns the archive storage instance, creating it on first call.
 * Safe to call from any async context (always after native bridge is ready).
 *
 * @returns {ReturnType<typeof createAsyncStorage>}
 */
export function getArchiveStorage() {
  if (_archive === null) {
    _archive = createAsyncStorage('chat-archive');
  }
  return _archive;
}