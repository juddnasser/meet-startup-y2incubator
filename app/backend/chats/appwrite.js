/**
 * appwrite.js
 * Loading and processing functions for messages received from Appwrite.
 *
 * Appwrite temporarily holds messages in a collection while they are in transit.
 * Each row has the shape:
 *   {
 *     sender_id:  string,   // ID of the peer who sent the message
 *     sent_id:    string,   // Unique message ID assigned by Appwrite
 *     content:    string,   // Message text
 *     $createdAt: string,   // ISO 8601 datetime string e.g. "2026-03-12T10:00:00.000Z"
 *   }
 *
 * These functions normalize Appwrite rows into the internal Message shape
 * and patch them into primary storage.
 */

import { patchMessage } from './primary.js';

// ─── Transform ───────────────────────────────────────────────────────────────

/**
 * Converts a raw Appwrite row into the internal Message format.
 *
 * @param {import('./types.js').AppwriteRow} row  - Raw row from Appwrite
 * @param {string}                           myId - The local user's peer ID,
 *                                                  used to determine direction
 * @returns {import('./types.js').Message}
 */
export function processAppwriteRow(row, myId) {
  return {
    id: row.sent_id,
    senderId: row.sender_id,
    content: row.content,
    dateSent: new Date(row.$createdAt).getTime(), // ISO → Unix ms
    direction: row.sender_id === myId ? 'sent' : 'received',
    edited: false,
  };
}

// ─── Load a single inbound message from Appwrite ─────────────────────────────

/**
 * Processes a single Appwrite row and patches it into primary storage.
 * Call this when your Appwrite realtime subscription fires for a new message.
 *
 * @param {import('./types.js').AppwriteRow} row
 * @param {string}                           myId - Local user's peer ID
 * @returns {Promise<import('./types.js').Message>} The processed message,
 *                                                  ready to push into UI state
 */
export async function loadInboundMessage(row, myId) {
  const message = processAppwriteRow(row, myId);

  // peerId for storage = the *other* person's ID regardless of direction
  const peerId = message.direction === 'received'
    ? message.senderId
    : myId; // outbound message echoed back from server — store under recipient

  await patchMessage(peerId, message);
  return message;
}

// ─── Load a batch of messages from Appwrite (initial sync / backfill) ────────

/**
 * Processes an array of Appwrite rows (e.g. from a listDocuments() call)
 * and patches each one into primary storage in chronological order.
 *
 * Rows are sorted by $createdAt before processing so storage stays ordered
 * even if Appwrite returns them out of sequence.
 *
 * @param {import('./types.js').AppwriteRow[]} rows
 * @param {string}                             myId - Local user's peer ID
 * @param {string}                             peerId - The peer this batch belongs to
 * @returns {Promise<import('./types.js').Message[]>} All processed messages,
 *                                                    sorted oldest → newest
 */
export async function loadMessageBatch(rows, myId, peerId) {
  // Sort oldest → newest before patching to preserve archive eviction order
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

// ─── Deduplicate helper ───────────────────────────────────────────────────────

/**
 * Filters out Appwrite rows whose sent_id already exists in the provided
 * existing message list. Use this before calling loadMessageBatch() during
 * a re-sync to avoid writing duplicate messages.
 *
 * @param {import('./types.js').AppwriteRow[]} rows
 * @param {import('./types.js').Message[]}     existingMessages
 * @returns {import('./types.js').AppwriteRow[]} Only the genuinely new rows
 */
export function deduplicateRows(rows, existingMessages) {
  const existingIds = new Set(existingMessages.map((m) => m.id));
  return rows.filter((row) => !existingIds.has(row.sent_id));
}
