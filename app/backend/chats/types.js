/**
 * types.js
 * Shared type definitions (JSDoc) and constants used across the storage layer.
 */

export const PRIMARY_MAX = 300;  // max messages kept in primaryStorage per peer
export const ARCHIVE_BATCH_SIZE = 300; // messages per archive batch

/**
 * @typedef {Object} Message
 * @property {string}          id          - Unique message ID (maps to Appwrite sent_id)
 * @property {string}          senderId    - Peer who sent the message (maps to Appwrite sender_id)
 * @property {string}          content     - Message text content
 * @property {number}          dateSent    - Unix timestamp (ms) — derived from Appwrite $createdAt
 * @property {'sent'|'received'} direction - 'sent' = outbound, 'received' = inbound
 * @property {boolean}         [edited]    - True if the message has been edited
 * @property {number}          [editedAt]  - Unix timestamp (ms) of last edit
 */

/**
 * @typedef {Object} Conversation
 * @property {string}    sender    - Peer ID this conversation belongs to
 * @property {Message[]} messages  - Ordered array of messages (oldest → newest)
 */

/**
 * @typedef {Object} ArchiveMeta
 * @property {string} peerId       - Peer ID this archive belongs to
 * @property {number} totalBatches - Total number of archive batches stored
 */

/**
 * @typedef {Object} AppwriteRow
 * Raw row shape as returned from the Appwrite messages collection.
 * @property {string} sender_id   - ID of the sender
 * @property {string} sent_id     - Unique message ID assigned by Appwrite
 * @property {string} content     - Message text
 * @property {string} $createdAt  - ISO 8601 datetime string
 */
