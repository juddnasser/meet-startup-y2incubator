/**
 * useChat.js
 * React hook that wires the storage layer to the frontend.
 *
 * Exposes exactly the surface area a chat screen needs:
 *   - messages          current primary messages (live 300)
 *   - loading           true while initial load is in progress
 *   - hasOlderMessages  true if archive batches exist to load
 *   - sendMessage(text) send + persist an outbound message
 *   - editMessage(id, newContent)
 *   - deleteMessage(id)
 *   - loadOlderMessages() paginate one archive batch backwards
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  patchMessage,
  readMessages,
  editMessage   as storageEditMessage,
  deleteMessage as storageDeleteMessage,
  getArchiveBatchCount,
  readArchiveBatch,
  loadInboundMessage,
  deduplicateRows,
  loadMessageBatch,
} from './index.js';

/**
 * @param {string}   peerId       - The remote peer's ID
 * @param {string}   myId         - The local user's peer ID
 * @param {object}   p2pTransport - Your P2P transport adapter (see interface below)
 *
 * p2pTransport interface expected:
 *   p2pTransport.send(peerId, message)       → Promise<void>
 *   p2pTransport.onMessage(peerId, handler)  → unsubscribe()
 */
export function useChat(peerId, myId, p2pTransport) {
  const [messages,          setMessages]         = useState([]);
  const [loading,           setLoading]          = useState(true);
  const [hasOlderMessages,  setHasOlderMessages] = useState(false);
  const archivePageRef = useRef(null); // tracks which archive batch to load next

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

      // Start pagination from the most recent archive batch
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
      // appwriteRow is the raw Appwrite shape: { sender_id, sent_id, content, $createdAt }
      const current  = await readMessages(peerId);
      const newRows   = deduplicateRows([appwriteRow], current);
      if (newRows.length === 0) return; // already stored

      const message = await loadInboundMessage(appwriteRow, myId);
      setMessages((prev) => {
        const updated = [...prev, message];
        // Keep UI list trimmed to 300 to match primary storage
        return updated.slice(-300).sort((a, b) => a.dateSent - b.dateSent);
      });
    });

    return unsubscribe;
  }, [peerId, myId, p2pTransport]);

  // ── CRUD: send a new outbound message ─────────────────────────────────────
  const sendMessage = useCallback(async (content) => {
    const message = {
      id:        crypto.randomUUID(),
      senderId:  myId,
      content,
      dateSent:  Date.now(),
      direction: 'sent',
      edited:    false,
    };

    // Persist before sending — crash-safe
    await patchMessage(peerId, message);
    await p2pTransport.send(peerId, message);

    setMessages((prev) =>
      [...prev, message].slice(-300).sort((a, b) => a.dateSent - b.dateSent)
    );
  }, [peerId, myId, p2pTransport]);

  // ── CRUD: edit an existing message ────────────────────────────────────────
  const editMessage = useCallback(async (messageId, newContent) => {
    const result = await storageEditMessage(peerId, messageId, newContent);

    if (result !== 'not_found') {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, content: newContent, edited: true, editedAt: Date.now() }
            : m
        )
      );
    }

    return result;
  }, [peerId]);

  // ── CRUD: delete a message ────────────────────────────────────────────────
  const deleteMessage = useCallback(async (messageId) => {
    const result = await storageDeleteMessage(peerId, messageId);

    if (result !== 'not_found') {
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    }

    return result;
  }, [peerId]);

  // ── Pagination: load one archive batch older than current view ────────────
  const loadOlderMessages = useCallback(async () => {
    if (archivePageRef.current === null || archivePageRef.current < 0) {
      setHasOlderMessages(false);
      return;
    }

    const batch = await readArchiveBatch(peerId, archivePageRef.current);
    archivePageRef.current -= 1;

    if (archivePageRef.current < 0) {
      setHasOlderMessages(false);
    }

    if (batch.length > 0) {
      setMessages((prev) => [...batch, ...prev]); // prepend older messages
    }
  }, [peerId]);

  // ── Bulk sync: load a batch from Appwrite (e.g. on first connection) ──────
  const syncFromAppwrite = useCallback(async (appwriteRows) => {
    const current  = await readMessages(peerId);
    const newRows   = deduplicateRows(appwriteRows, current);
    if (newRows.length === 0) return;

    const processed = await loadMessageBatch(newRows, myId, peerId);
    const refreshed = await readMessages(peerId); // re-read after batch patch
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
