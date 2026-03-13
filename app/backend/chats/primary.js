/**
 * primary.js
 * CRUD operations for the primary (live) message storage.
 *
 * Rules:
 *  - Primary holds at most PRIMARY_MAX (300) messages per peer.
 *  - When a new message would push the count over 300, the oldest message
 *    is evicted and handed to archiveMessage() before the new one is written.
 *  - All messages are kept sorted oldest → newest by dateSent.
 *
 * Key schema:
 *   chat:<peerId>  → Conversation (JSON)
 */

import { primaryStorage } from './instances.js';
import { archiveMessage }  from './archive.js';
import { PRIMARY_MAX }     from './types.js';

// ─── Internal key helper ─────────────────────────────────────────────────────

const convKey = (peerId) => `chat:${peerId}`;

// ─── Internal: load raw conversation from storage ───────────────────────────

async function getConversation(peerId) {
  const raw = await primaryStorage.getItem(convKey(peerId));
  return raw
    ? JSON.parse(raw)
    : { sender: peerId, messages: [] };
}

// ─── Internal: persist a conversation to storage ────────────────────────────

async function saveConversation(peerId, conversation) {
  await primaryStorage.setItem(convKey(peerId), JSON.stringify(conversation));
}

// ════════════════════════════════════════════════════════════════════════════
//  CREATE — patch a new message into primary storage
// ════════════════════════════════════════════════════════════════════════════

/**
 * Appends a new message to the primary storage for a peer.
 *
 * If the message count is already at PRIMARY_MAX, the oldest message is
 * evicted to the archive before the new one is inserted, keeping the
 * primary window capped at exactly 300.
 *
 * @param {string} peerId   - The peer this conversation belongs to
 * @param {import('./types.js').Message} message - Fully-formed Message object
 * @returns {Promise<void>}
 */
export async function patchMessage(peerId, message) {
  const conversation = await getConversation(peerId);

  // Evict oldest if at capacity
  if (conversation.messages.length >= PRIMARY_MAX) {
    const evicted = conversation.messages.shift(); // removes index 0 (oldest)
    await archiveMessage(peerId, evicted);
  }

  conversation.messages.push(message);

  // Ensure chronological order (handles out-of-order P2P delivery)
  conversation.messages.sort((a, b) => a.dateSent - b.dateSent);

  await saveConversation(peerId, conversation);
}

// ════════════════════════════════════════════════════════════════════════════
//  READ — load messages from primary storage
// ════════════════════════════════════════════════════════════════════════════

/**
 * Returns all messages currently in primary storage for a peer (up to 300).
 * These are the "live" messages the frontend renders by default.
 *
 * @param {string} peerId
 * @returns {Promise<import('./types.js').Message[]>} Sorted oldest → newest
 */
export async function readMessages(peerId) {
  const conversation = await getConversation(peerId);
  return conversation.messages;
}

// ════════════════════════════════════════════════════════════════════════════
//  UPDATE — edit an existing message in primary storage
// ════════════════════════════════════════════════════════════════════════════

/**
 * Edits the content of a message in primary storage by its ID.
 * Marks the message as edited and records the edit timestamp.
 *
 * If the message is not found in primary, delegates to editArchivedMessage().
 *
 * @param {string} peerId
 * @param {string} messageId  - The message's unique ID (maps to Appwrite sent_id)
 * @param {string} newContent - The replacement content
 * @returns {Promise<'primary'|'archive'|'not_found'>} Where the edit was applied
 */
export async function editMessage(peerId, messageId, newContent) {
  const conversation = await getConversation(peerId);
  const idx = conversation.messages.findIndex((m) => m.id === messageId);

  if (idx !== -1) {
    conversation.messages[idx] = {
      ...conversation.messages[idx],
      content:  newContent,
      edited:   true,
      editedAt: Date.now(),
    };
    await saveConversation(peerId, conversation);
    return 'primary';
  }

  // Not in primary — check archive
  const { editArchivedMessage } = await import('./archive.js');
  const found = await editArchivedMessage(peerId, messageId, newContent);
  return found ? 'archive' : 'not_found';
}

// ════════════════════════════════════════════════════════════════════════════
//  DELETE — remove a message from primary storage
// ════════════════════════════════════════════════════════════════════════════

/**
 * Deletes a single message from primary storage by its ID.
 * If not found in primary, delegates to deleteArchivedMessage().
 *
 * @param {string} peerId
 * @param {string} messageId
 * @returns {Promise<'primary'|'archive'|'not_found'>} Where the deletion occurred
 */
export async function deleteMessage(peerId, messageId) {
  const conversation = await getConversation(peerId);
  const filtered = conversation.messages.filter((m) => m.id !== messageId);

  if (filtered.length !== conversation.messages.length) {
    conversation.messages = filtered;
    await saveConversation(peerId, conversation);
    return 'primary';
  }

  // Not in primary — check archive
  const { deleteArchivedMessage } = await import('./archive.js');
  const found = await deleteArchivedMessage(peerId, messageId);
  return found ? 'archive' : 'not_found';
}

// ════════════════════════════════════════════════════════════════════════════
//  DELETE — wipe an entire conversation from primary storage
// ════════════════════════════════════════════════════════════════════════════

/**
 * Removes the entire primary conversation record for a peer.
 * Caller should also invoke clearArchive(peerId) if full deletion is needed.
 *
 * @param {string} peerId
 * @returns {Promise<void>}
 */
export async function deleteConversation(peerId) {
  await primaryStorage.removeItem(convKey(peerId));
}
