/**
 * archive.js
 * Manages the archive storage — sealed batches of 300 messages evicted
 * from primary storage.
 *
 * Storage is accessed via getArchiveStorage() (lazy getter) so the native
 * module is never touched at import time.
 *
 * Key schema
 * ──────────
 * "archive:<peerId>:meta"           → ArchiveMeta  (JSON)
 * "archive:<peerId>:batch:<index>"  → Message[]    (JSON)
 *
 * Batch indexing
 * ──────────────
 * Index 0 = oldest batch.
 * Index (totalBatches - 1) = most recently opened (possibly still filling) batch.
 * A batch is sealed once it reaches ARCHIVE_BATCH_SIZE — a new one opens after.
 */

import { getArchiveStorage }   from './instances.js';
import { ARCHIVE_BATCH_SIZE }  from './types.js';

// ─── Key helpers ──────────────────────────────────────────────────────────────

const metaKey  = (peerId) => `archive:${peerId}:meta`;
const batchKey = (peerId, index) => `archive:${peerId}:batch:${index}`;

// ─── Internal helpers ─────────────────────────────────────────────────────────

async function readMeta(peerId) {
  const raw = await getArchiveStorage().getItem(metaKey(peerId));
  return raw ? JSON.parse(raw) : { peerId, totalBatches: 0 };
}

async function writeMeta(meta) {
  await getArchiveStorage().setItem(metaKey(meta.peerId), JSON.stringify(meta));
}

async function readBatch(peerId, index) {
  const raw = await getArchiveStorage().getItem(batchKey(peerId, index));
  return raw ? JSON.parse(raw) : [];
}

async function writeBatch(peerId, index, messages) {
  await getArchiveStorage().setItem(
    batchKey(peerId, index),
    JSON.stringify(messages)
  );
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Appends an evicted message to the current open archive batch.
 * When the batch reaches ARCHIVE_BATCH_SIZE it is sealed and a new
 * empty batch is opened automatically.
 *
 * Called exclusively by primary.js — not intended for direct use.
 *
 * @param {string}                       peerId  - Peer this message belongs to
 * @param {import('./types.js').Message} message - The evicted message
 * @returns {Promise<void>}
 */
export async function archiveMessage(peerId, message) {
  const meta = await readMeta(peerId);

  // First ever archive write — open batch 0
  if (meta.totalBatches === 0) {
    await writeBatch(peerId, 0, [message]);
    meta.totalBatches = 1;
    await writeMeta(meta);
    return;
  }

  const openIndex = meta.totalBatches - 1;
  const openBatch = await readBatch(peerId, openIndex);

  openBatch.push(message);

  if (openBatch.length >= ARCHIVE_BATCH_SIZE) {
    // Seal the current batch and open a new empty one
    await writeBatch(peerId, openIndex, openBatch);
    const newIndex = meta.totalBatches;
    await writeBatch(peerId, newIndex, []);
    meta.totalBatches += 1;
    await writeMeta(meta);
  } else {
    await writeBatch(peerId, openIndex, openBatch);
  }
}

/**
 * Loads a specific archive batch by index.
 * 0 = oldest batch, (totalBatches - 1) = most recent.
 *
 * @param {string} peerId
 * @param {number} batchIndex
 * @returns {Promise<import('./types.js').Message[]>} Empty array if out of range
 */
export async function readArchiveBatch(peerId, batchIndex) {
  const meta = await readMeta(peerId);
  if (batchIndex < 0 || batchIndex >= meta.totalBatches) return [];
  return readBatch(peerId, batchIndex);
}

/**
 * Returns the total number of archive batches for a peer.
 * 0 means no archive exists yet.
 *
 * @param {string} peerId
 * @returns {Promise<number>}
 */
export async function getArchiveBatchCount(peerId) {
  const meta = await readMeta(peerId);
  return meta.totalBatches;
}

/**
 * Finds and edits a message across all archive batches.
 * Scans newest → oldest (edits most often target recent messages).
 *
 * @param {string} peerId
 * @param {string} messageId
 * @param {string} newContent
 * @returns {Promise<boolean>} true if found and updated
 */
export async function editArchivedMessage(peerId, messageId, newContent) {
  const meta = await readMeta(peerId);

  for (let i = meta.totalBatches - 1; i >= 0; i--) {
    const batch = await readBatch(peerId, i);
    const idx   = batch.findIndex((m) => m.id === messageId);

    if (idx !== -1) {
      batch[idx] = {
        ...batch[idx],
        content:  newContent,
        edited:   true,
        editedAt: Date.now(),
      };
      await writeBatch(peerId, i, batch);
      return true;
    }
  }

  return false;
}

/**
 * Finds and removes a message from across all archive batches.
 *
 * @param {string} peerId
 * @param {string} messageId
 * @returns {Promise<boolean>} true if found and deleted
 */
export async function deleteArchivedMessage(peerId, messageId) {
  const meta = await readMeta(peerId);

  for (let i = meta.totalBatches - 1; i >= 0; i--) {
    const batch    = await readBatch(peerId, i);
    const filtered = batch.filter((m) => m.id !== messageId);

    if (filtered.length !== batch.length) {
      await writeBatch(peerId, i, filtered);
      return true;
    }
  }

  return false;
}

/**
 * Deletes all archive batches and metadata for a peer.
 * Call alongside deleteConversation() for a complete wipe.
 *
 * @param {string} peerId
 * @returns {Promise<void>}
 */
export async function clearArchive(peerId) {
  const meta = await readMeta(peerId);

  for (let i = 0; i < meta.totalBatches; i++) {
    await getArchiveStorage().removeItem(batchKey(peerId, i));
  }

  await getArchiveStorage().removeItem(metaKey(peerId));
}
