/**
 * primary.js
 * CRUD operations against the primary (live) message storage.
 *
 * Storage is accessed via getPrimaryStorage() (lazy getter) so the native
 * module is never touched at import time.
 *
 * Invariants enforced by this module
 * ───────────────────────────────────
 * • Primary holds at most PRIMARY_MAX (300) messages per peer at all times.
 * • When a new message would exceed 300, the oldest message is evicted to
 *   archive BEFORE the new one is written — no messages are silently dropped.
 * • Messages are always kept sorted oldest → newest by dateSent.
 *
 * Key schema
 * ──────────
 * "chat:<peerId>"  →  Conversation (JSON)
 */

import { getPrimaryStorage }                       from './instances.js';
import { archiveMessage, editArchivedMessage,
         deleteArchivedMessage }                   from './archive.js';
import { PRIMARY_MAX }                             from './types.js';

// ─── Key helper ───────────────────────────────────────────────────────────────

const convKey = (peerId) => `chat:${peerId}`;

// ─── Internal helpers ─────────────────────────────────────────────────────────

async function readConversation(peerId) {
  const raw = await getPrimaryStorage().getItem(convKey(peerId));
  return raw ? JSON.parse(raw) : { sender: peerId, messages: [] };
}

async function writeConversation(peerId, conversation) {
  await getPrimaryStorage().setItem(convKey(peerId), JSON.stringify(conversation));
}

// ─── CREATE ───────────────────────────────────────────────────────────────────

/**
 * Appends a new message to primary storage for a peer.
 *
 * If adding this message would exceed PRIMARY_MAX (300), the oldest message
 * is evicted to the archive first, then the new message is written.
 *
 * @param {string}                       peerId  - The peer this message belongs to
 * @param {import('./types.js').Message} message - Fully-formed Message object
 * @returns {Promise<void>}
 */
export async function patchMessage(peerId, message) {
  const conversation = await readConversation(peerId);

  if (conversation.messages.length >= PRIMARY_MAX) {
    // Evict the oldest message to archive before inserting the new one
    const evicted = conversation.messages.shift();
    await archiveMessage(peerId, evicted);
  }

  conversation.messages.push(message);

  // Re-sort to handle out-of-order P2P delivery
  conversation.messages.sort((a, b) => a.dateSent - b.dateSent);

  await writeConversation(peerId, conversation);
}

// ─── READ ─────────────────────────────────────────────────────────────────────

/**
 * Returns all messages currently in primary storage for a peer (up to 300).
 * Always sorted oldest → newest.
 *
 * @param {string} peerId
 * @returns {Promise<import('./types.js').Message[]>}
 */
export async function readMessages(peerId) {
  const conversation = await readConversation(peerId);
  return conversation.messages;
}

// ─── UPDATE ───────────────────────────────────────────────────────────────────

/**
 * Edits the content of a message by its ID.
 *
 * Checks primary first. If not found, delegates to the archive.
 * Marks the message as edited and records the editedAt timestamp.
 *
 * @param {string} peerId
 * @param {string} messageId  - The message's unique ID (Appwrite sent_id)
 * @param {string} newContent - Replacement content string
 * @returns {Promise<'primary'|'archive'|'not_found'>}
 */
export async function editMessage(peerId, messageId, newContent) {
  const conversation = await readConversation(peerId);
  const idx = conversation.messages.findIndex((m) => m.id === messageId);

  if (idx !== -1) {
    conversation.messages[idx] = {
      ...conversation.messages[idx],
      content:  newContent,
      edited:   true,
      editedAt: Date.now(),
    };
    await writeConversation(peerId, conversation);
    return 'primary';
  }

  const found = await editArchivedMessage(peerId, messageId, newContent);
  return found ? 'archive' : 'not_found';
}

// ─── DELETE (single message) ──────────────────────────────────────────────────

/**
 * Deletes a single message by its ID.
 *
 * Checks primary first. If not found, delegates to the archive.
 *
 * @param {string} peerId
 * @param {string} messageId
 * @returns {Promise<'primary'|'archive'|'not_found'>}
 */
export async function deleteMessage(peerId, messageId) {
  const conversation = await readConversation(peerId);
  const filtered = conversation.messages.filter((m) => m.id !== messageId);

  if (filtered.length !== conversation.messages.length) {
    conversation.messages = filtered;
    await writeConversation(peerId, conversation);
    return 'primary';
  }

  const found = await deleteArchivedMessage(peerId, messageId);
  return found ? 'archive' : 'not_found';
}

// ─── DELETE (entire conversation) ────────────────────────────────────────────

/**
 * Removes the entire primary conversation record for a peer.
 *
 * Does NOT clear the archive — call clearArchive(peerId) from archive.js
 * alongside this if a full deletion is required.
 *
 * @param {string} peerId
 * @returns {Promise<void>}
 */
export async function deleteConversation(peerId) {
  await getPrimaryStorage().removeItem(convKey(peerId));
}
