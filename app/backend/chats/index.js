/**
 * index.js
 * Public API for the chat storage layer.
 * Import everything your frontend needs from here.
 *
 * ─── Quick reference ────────────────────────────────────────────────────────
 *
 * PRIMARY CRUD
 *   patchMessage(peerId, message)              → Promise<void>
 *   readMessages(peerId)                       → Promise<Message[]>
 *   editMessage(peerId, messageId, newContent) → Promise<'primary'|'archive'|'not_found'>
 *   deleteMessage(peerId, messageId)           → Promise<'primary'|'archive'|'not_found'>
 *   deleteConversation(peerId)                 → Promise<void>
 *
 * ARCHIVE (paginated history)
 *   readArchiveBatch(peerId, batchIndex)       → Promise<Message[]>
 *   getArchiveBatchCount(peerId)               → Promise<number>
 *   clearArchive(peerId)                       → Promise<void>
 *
 * APPWRITE PROCESSING
 *   processAppwriteRow(row, myId)              → Message          (sync, no storage write)
 *   loadInboundMessage(row, myId)              → Promise<Message> (transform + patch)
 *   loadMessageBatch(rows, myId, peerId)       → Promise<Message[]> (bulk transform + patch)
 *   deduplicateRows(rows, existingMessages)    → AppwriteRow[]    (filter already-stored)
 *
 * PLATFORM
 *   generateId()                               → Promise<string>  (cross-platform UUID)
 *   isAndroid                                  → boolean
 *   isIOS                                      → boolean
 *   platformLabel()                            → string           (e.g. "ios 17.4")
 *
 * HOOK
 *   useChat(peerId, myId, p2pTransport)        → { messages, loading, hasOlderMessages,
 *                                                   sendMessage, editMessage, deleteMessage,
 *                                                   loadOlderMessages, syncFromAppwrite }
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

export {
  generateId,
  isAndroid,
  isIOS,
  platformLabel,
} from './platform.js';

export { useChat } from './useChat.js';
