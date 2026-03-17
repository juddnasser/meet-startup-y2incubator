/**
 * useChat.js
 * React hook that connects the storage layer to the chat UI.
 *
 * All storage access happens inside useEffect / useCallback callbacks —
 * never at the top level — so the native module is always fully initialised
 * before any storage call is made.
 *
 * Returned surface area
 * ─────────────────────
 *   messages            Message[]  — current primary window (up to 300)
 *   loading             boolean    — true during the initial storage load
 *   hasOlderMessages    boolean    — true while archive batches remain to load
 *   sendMessage(text)              — compose, persist, and transmit a message
 *   editMessage(id, content)       — edit in-place (primary, archive fallback)
 *   deleteMessage(id)              — delete by ID (primary, archive fallback)
 *   loadOlderMessages()            — prepend one archive batch (call on scroll-up)
 *   syncFromAppwrite(rows)         — bulk-ingest Appwrite rows on connect / backfill
 *
 * Expected p2pTransport interface
 * ────────────────────────────────
 *   p2pTransport.send(peerId, message)       → Promise<void>
 *   p2pTransport.onMessage(peerId, handler)  → unsubscribeFn
 *
 *   The handler receives a raw Appwrite row:
 *     { sender_id, sent_id, content, $createdAt }
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { generateId }             from './platform.js';
import {
  patchMessage,
  readMessages,
  editMessage   as storageEdit,
  deleteMessage as storageDelete,
} from './primary.js';
import {
  getArchiveBatchCount,
  readArchiveBatch,
} from './archive.js';
import {
  loadInboundMessage,
  loadMessageBatch,
  deduplicateRows,
} from './appwrite.js';

/**
 * @param {string} peerId        - Remote peer's ID
 * @param {string} myId          - Local user's peer ID
 * @param {object} p2pTransport  - Transport adapter (see interface above)
 */
export function useChat(peerId, myId, p2pTransport) {
  const [messages,         setMessages]         = useState([]);
  const [loading,          setLoading]          = useState(true);
  const [hasOlderMessages, setHasOlderMessages] = useState(false);

  // Tracks the next archive batch index to load on scroll-up.
  // Counts down from (totalBatches - 1) toward 0.
  const archivePageRef = useRef(null);

  // ── Initial load ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!peerId) return;

    let cancelled = false;

    async function init() {
      setLoading(true);

      const [primary, batchCount] = await Promise.all([
        readMessages(peerId),
        getArchiveBatchCount(peerId),
      ]);

      if (cancelled) return;

      setMessages(primary);
      setHasOlderMessages(batchCount > 0);
      archivePageRef.current = batchCount - 1;
      setLoading(false);
    }

    init();
    return () => { cancelled = true; };
  }, [peerId]);

  // ── Inbound P2P messages ───────────────────────────────────────────────────
  useEffect(() => {
    if (!peerId || !p2pTransport) return;

    const unsubscribe = p2pTransport.onMessage(peerId, async (appwriteRow) => {
      const current = await readMessages(peerId);
      const newRows  = deduplicateRows([appwriteRow], current);
      if (newRows.length === 0) return; // already stored — skip

      const message = await loadInboundMessage(appwriteRow, myId);

      setMessages((prev) =>
        [...prev, message]
          .sort((a, b) => a.dateSent - b.dateSent)
          .slice(-300)
      );
    });

    return unsubscribe;
  }, [peerId, myId, p2pTransport]);

  // ── CRUD: send ─────────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (content) => {
    const message = {
      id:        await generateId(),
      senderId:  myId,
      content,
      dateSent:  Date.now(),
      direction: 'sent',
      edited:    false,
    };

    // Persist before transmitting — crash-safe ordering
    await patchMessage(peerId, message);
    await p2pTransport.send(peerId, message);

    setMessages((prev) =>
      [...prev, message]
        .sort((a, b) => a.dateSent - b.dateSent)
        .slice(-300)
    );
  }, [peerId, myId, p2pTransport]);

  // ── CRUD: edit ─────────────────────────────────────────────────────────────
  const editMessage = useCallback(async (messageId, newContent) => {
    const result = await storageEdit(peerId, messageId, newContent);

    if (result !== 'not_found') {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, content: newContent, edited: true, editedAt: Date.now() }
            : m
        )
      );
    }

    return result; // 'primary' | 'archive' | 'not_found'
  }, [peerId]);

  // ── CRUD: delete ───────────────────────────────────────────────────────────
  const deleteMessage = useCallback(async (messageId) => {
    const result = await storageDelete(peerId, messageId);

    if (result !== 'not_found') {
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    }

    return result; // 'primary' | 'archive' | 'not_found'
  }, [peerId]);

  // ── Pagination: load one archive batch older than current view ────────────
  const loadOlderMessages = useCallback(async () => {
    if (archivePageRef.current === null || archivePageRef.current < 0) {
      setHasOlderMessages(false);
      return;
    }

    const batch = await readArchiveBatch(peerId, archivePageRef.current);
    archivePageRef.current -= 1;

    if (archivePageRef.current < 0) setHasOlderMessages(false);
    if (batch.length > 0) {
      setMessages((prev) => [...batch, ...prev]); // prepend older messages
    }
  }, [peerId]);

  // ── Bulk sync from Appwrite (on connect / backfill) ───────────────────────
  const syncFromAppwrite = useCallback(async (appwriteRows) => {
    const current = await readMessages(peerId);
    const newRows  = deduplicateRows(appwriteRows, current);
    if (newRows.length === 0) return [];

    const processed = await loadMessageBatch(newRows, myId, peerId);
    const refreshed  = await readMessages(peerId); // re-read after all patches
    setMessages(refreshed);
    return processed;
  }, [peerId, myId]);

  return {
    messages,
    loading,
    hasOlderMessages,
    sendMessage,
    editMessage,
    deleteMessage,
    loadOlderMessages,
    syncFromAppwrite,
  };
}
