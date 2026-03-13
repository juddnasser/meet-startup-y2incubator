/**
 * index.js — Public API for the chat storage layer.
 *
 * Import everything your frontend hooks need from here.
 * The internal modules (instances, archive internals) stay encapsulated.
 *
 * ─── Usage quick-reference ─────────────────────────────────────────────────
 *
 * PRIMARY CRUD
 *   patchMessage(peerId, message)              → void
 *   readMessages(peerId)                       → Message[]
 *   editMessage(peerId, messageId, newContent) → 'primary'|'archive'|'not_found'
 *   deleteMessage(peerId, messageId)           → 'primary'|'archive'|'not_found'
 *   deleteConversation(peerId)                 → void
 *
 * ARCHIVE (paginated history)
 *   readArchiveBatch(peerId, batchIndex)       → Message[]
 *   getArchiveBatchCount(peerId)               → number
 *   clearArchive(peerId)                       → void
 *
 * APPWRITE PROCESSING
 *   processAppwriteRow(row, myId)              → Message   (sync transform, no storage)
 *   loadInboundMessage(row, myId)              → Message   (transform + patch)
 *   loadMessageBatch(rows, myId, peerId)       → Message[] (bulk transform + patch)
 *   deduplicateRows(rows, existingMessages)    → AppwriteRow[] (filter already-stored)
 */

export {
  patchMessage,
  readMessages,
  editMessage,
  deleteMessage,
  deleteConversation,
} from './primary.js';

export {
  readArchiveBatch,
  getArchiveBatchCount,
  clearArchive,
} from './archive.js';

export {
  processAppwriteRow,
  loadInboundMessage,
  loadMessageBatch,
  deduplicateRows,
} from './appwrite.js';
