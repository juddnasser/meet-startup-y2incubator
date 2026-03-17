/**
 * appwrite.js
 * Loading and processing functions for messages received from Appwrite.
 *
 * Appwrite temporarily holds messages in a collection while they are in
 * transit between peers. Each document has the following shape:
 *
 *   {
 *     sender_id:  string   — ID of the peer who sent the message
 *     sent_id:    string   — Unique message ID assigned by Appwrite
 *     content:    string   — Message text
 *     $createdAt: string   — ISO 8601 datetime e.g. "2026-03-12T10:00:00.000Z"
 *   }
 *
 * These functions normalise Appwrite rows into the internal Message shape
 * and write them into primary storage via patchMessage().
 *
 * No storage instances are touched at import time — all storage access
 * happens through patchMessage() which uses the lazy getter internally.
 */

import { patchMessage } from './primary.js';

// ─── Transform ────────────────────────────────────────────────────────────────

/**
 * Converts a single raw Appwrite document into the internal Message format.
 * Pure transform — does NOT write to storage.
 *
 * @param {import('./types.js').AppwriteRow} row  - Raw Appwrite document
 * @param {string}                           myId - Local user's peer ID
 * @returns {import('./types.js').Message}
 */
export function processAppwriteRow(row, myId) {
  return {
    id:        row.sent_id,
    senderId:  row.sender_id,
    content:   row.content,
    dateSent:  new Date(row.$createdAt).getTime(), // ISO 8601 → Unix ms
    direction: row.sender_id === myId ? 'sent' : 'received',
    edited:    false,
  };
}

// ─── Single inbound message ───────────────────────────────────────────────────

/**
 * Processes a single Appwrite document and writes it into primary storage.
 *
 * Call this from your Appwrite Realtime subscription handler when a new
 * message document is created.
 *
 * @param {import('./types.js').AppwriteRow} row  - Raw Appwrite document
 * @param {string}                           myId - Local user's peer ID
 * @returns {Promise<import('./types.js').Message>}
 *   The processed Message, ready to append directly to UI state.
 */
export async function loadInboundMessage(row, myId) {
  const message = processAppwriteRow(row, myId);

  // Always store under the remote peer's ID regardless of direction
  const peerId = message.direction === 'received'
    ? message.senderId // inbound: sender is the remote peer
    : myId;            // outbound echo from server: store under local user

  await patchMessage(peerId, message);
  return message;
}

// ─── Batch load (initial sync / backfill) ────────────────────────────────────

/**
 * Processes an array of Appwrite documents and writes them all to primary
 * storage. Rows are sorted by $createdAt ascending before processing so
 * archive eviction order is always chronologically correct.
 *
 * Call this on app launch or on reconnect to sync messages received while
 * the device was offline.
 *
 * @param {import('./types.js').AppwriteRow[]} rows   - Raw Appwrite documents
 * @param {string}                             myId   - Local user's peer ID
 * @param {string}                             peerId - The remote peer these messages belong to
 * @returns {Promise<import('./types.js').Message[]>}
 *   All processed messages sorted oldest → newest.
 */
export async function loadMessageBatch(rows, myId, peerId) {
  const sorted = [...rows].sort(
    (a, b) => new Date(a.$createdAt).getTime() - new Date(b.$createdAt).getTime()
  );

  const processed = [];
  for (const row of sorted) {
    const message = processAppwriteRow(row, myId);
    await patchMessage(peerId, message);
    processed.push(message);
  }

  return processed;
}

// ─── Deduplication ───────────────────────────────────────────────────────────

/**
 * Filters an array of Appwrite rows, removing any whose sent_id already
 * exists in the provided existing message list.
 *
 * Use this before calling loadMessageBatch() during a re-sync to avoid
 * writing duplicate messages into storage.
 *
 * @param {import('./types.js').AppwriteRow[]} rows
 * @param {import('./types.js').Message[]}     existingMessages
 * @returns {import('./types.js').AppwriteRow[]} Only the genuinely new rows
 */
export function deduplicateRows(rows, existingMessages) {
  const existingIds = new Set(existingMessages.map((m) => m.id));
  return rows.filter((row) => !existingIds.has(row.sent_id));
}
