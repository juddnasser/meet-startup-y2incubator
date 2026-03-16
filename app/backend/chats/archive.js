/**
 * archive.js
 * Manages the archive storage — batches of 300 messages evicted from primary.
 *
 * Key schema:
 *   archive:<peerId>:meta          → ArchiveMeta
 *   archive:<peerId>:batch:<index> → Message[]
 */

import { archiveStorage } from './instances.js';
import { ARCHIVE_BATCH_SIZE } from './types.js';

// ─── Internal key helpers ────────────────────────────────────────────────────

const metaKey = (peerId) => `archive:${peerId}:meta`;
const batchKey = (peerId, index) => `archive:${peerId}:batch:${index}`;

// ─── Internal: read archive metadata ────────────────────────────────────────

async function getArchiveMeta(peerId) {
  const raw = await archiveStorage.getItem(metaKey(peerId));
  return raw
    ? JSON.parse(raw)
    : { peerId, totalBatches: 0 };
}

// ─── Internal: write archive metadata ───────────────────────────────────────

async function saveArchiveMeta(meta) {
  await archiveStorage.setItem(metaKey(meta.peerId), JSON.stringify(meta));
}

// ─── Internal: read a single batch ──────────────────────────────────────────

async function getArchiveBatch(peerId, batchIndex) {
  const raw = await archiveStorage.getItem(batchKey(peerId, batchIndex));
  return raw ? JSON.parse(raw) : [];
}

// ─── Internal: write a single batch ─────────────────────────────────────────

async function saveArchiveBatch(peerId, batchIndex, messages) {
  await archiveStorage.setItem(
    batchKey(peerId, batchIndex),
    JSON.stringify(messages)
  );
}

// ─── Public: push one evicted message into the archive ──────────────────────

/**
 * Called by primary.js whenever a message is evicted from primary storage.
 * Appends the message to the current open archive batch.
 * When that batch reaches ARCHIVE_BATCH_SIZE, it is sealed and a new one opens.
 *
 * @param {string}  peerId  - The peer this message belongs to
 * @param {import('./types.js').Message} message - The evicted message
 */
export async function archiveMessage(peerId, message) {
  const meta = await getArchiveMeta(peerId);

  // The "open" (current) batch index is always the last one
  const openBatchIndex = meta.totalBatches === 0 ? 0 : meta.totalBatches - 1;
  const openBatch = await getArchiveBatch(peerId, openBatchIndex);

  openBatch.push(message);

  if (openBatch.length >= ARCHIVE_BATCH_SIZE) {
    // Seal the current batch and start a new one
    await saveArchiveBatch(peerId, openBatchIndex, openBatch);
    meta.totalBatches += 1;
    await saveArchiveMeta(meta);
    // Initialize the new empty batch
    await saveArchiveBatch(peerId, meta.totalBatches - 1, []);
  } else {
    await saveArchiveBatch(peerId, openBatchIndex, openBatch);

    // Ensure meta is initialised if this is the very first archive message
    if (meta.totalBatches === 0) {
      meta.totalBatches = 1;
      await saveArchiveMeta(meta);
    }
  }
}

// ─── Public: read a specific archive batch (for paginated history) ───────────

/**
 * Loads a specific archive batch by its index.
 * Index 0 = oldest batch. Index (totalBatches - 1) = most recently sealed batch.
 *
 * @param {string} peerId
 * @param {number} batchIndex
 * @returns {Promise<import('./types.js').Message[]>}
 */
export async function readArchiveBatch(peerId, batchIndex) {
  const meta = await getArchiveMeta(peerId);

  if (batchIndex < 0 || batchIndex >= meta.totalBatches) {
    return [];
  }

  return await getArchiveBatch(peerId, batchIndex);
}

// ─── Public: get total number of archive batches ────────────────────────────

/**
 * Returns the number of archive batches for a peer.
 * Useful for driving paginated "load older messages" UI.
 *
 * @param {string} peerId
 * @returns {Promise<number>}
 */
export async function getArchiveBatchCount(peerId) {
  const meta = await getArchiveMeta(peerId);
  return meta.totalBatches;
}

// ─── Public: edit a message inside the archive ──────────────────────────────

/**
 * Finds and edits a message by its ID across all archive batches for a peer.
 * Scans from the most recent batch backwards (most likely location of recent edits).
 *
 * @param {string} peerId
 * @param {string} messageId
 * @param {string} newContent
 * @returns {Promise<boolean>} true if the message was found and updated
 */
export async function editArchivedMessage(peerId, messageId, newContent) {
  const meta = await getArchiveMeta(peerId);

  // Scan batches newest → oldest
  for (let i = meta.totalBatches - 1; i >= 0; i--) {
    const batch = await getArchiveBatch(peerId, i);
    const idx = batch.findIndex((m) => m.id === messageId);

    if (idx !== -1) {
      batch[idx] = {
        ...batch[idx],
        content: newContent,
        edited: true,
        editedAt: Date.now(),
      };
      await saveArchiveBatch(peerId, i, batch);
      return true;
    }
  }

  return false; // not found
}

// ─── Public: delete a message from the archive ──────────────────────────────

/**
 * Finds and removes a message by its ID from the archive.
 *
 * @param {string} peerId
 * @param {string} messageId
 * @returns {Promise<boolean>} true if found and deleted
 */
export async function deleteArchivedMessage(peerId, messageId) {
  const meta = await getArchiveMeta(peerId);

  for (let i = meta.totalBatches - 1; i >= 0; i--) {
    const batch = await getArchiveBatch(peerId, i);
    const filtered = batch.filter((m) => m.id !== messageId);

    if (filtered.length !== batch.length) {
      await saveArchiveBatch(peerId, i, filtered);
      return true;
    }
  }

  return false;
}

// ─── Public: wipe all archive data for a peer ───────────────────────────────

/**
 * Deletes all archive batches and meta for a peer.
 * Called when a full conversation is deleted.
 *
 * @param {string} peerId
 */
export async function clearArchive(peerId) {
  const meta = await getArchiveMeta(peerId);

  for (let i = 0; i < meta.totalBatches; i++) {
    await archiveStorage.removeItem(batchKey(peerId, i));
  }

  await archiveStorage.removeItem(metaKey(peerId));
}
