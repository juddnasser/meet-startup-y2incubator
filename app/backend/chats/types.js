/**
 * types.js
 * Shared constants and JSDoc type definitions used across the storage layer.
 */

/** Maximum messages kept in primary storage per peer. */
export const PRIMARY_MAX = 300;

/** Number of messages per sealed archive batch. */
export const ARCHIVE_BATCH_SIZE = 300;

/**
 * @typedef {Object} Message
 * @property {string}            id         - Unique ID (maps to Appwrite sent_id)
 * @property {string}            senderId   - Peer who sent it (maps to Appwrite sender_id)
 * @property {string}            content    - Message text
 * @property {number}            dateSent   - Unix ms timestamp (derived from Appwrite $createdAt)
 * @property {'sent'|'received'} direction  - Relative to the local user
 * @property {boolean}           edited     - Whether the message has been edited
 * @property {number}            [editedAt] - Unix ms timestamp of last edit
 */

/**
 * @typedef {Object} Conversation
 * @property {string}    sender   - Peer ID this conversation belongs to
 * @property {Message[]} messages - Chronologically sorted array (oldest → newest)
 */

/**
 * @typedef {Object} ArchiveMeta
 * @property {string} peerId       - Peer ID this archive belongs to
 * @property {number} totalBatches - Total number of stored archive batches
 */

/**
 * @typedef {Object} AppwriteRow
 * Raw document shape returned from the Appwrite messages collection.
 * @property {string} sender_id  - ID of the sender
 * @property {string} sent_id    - Unique message ID assigned by Appwrite
 * @property {string} content    - Message text
 * @property {string} $createdAt - ISO 8601 datetime string e.g. "2026-03-12T10:00:00.000Z"
 */
