import { createAsyncStorage } from '@react-native-async-storage/async-storage';

/**
 * PRIMARY storage — holds the live 300 most recent messages per peer.
 * Key pattern:  "peer:<peerId>"
 * Value:        JSON → { sender: string, messages: Message[] }
 */
export const primaryStorage = createAsyncStorage('chat-primary');

/**
 * ARCHIVE storage — holds batches of 300 messages that were evicted
 * from primaryStorage. Each batch is an immutable snapshot.
 *
 * Key pattern:  "archive:<peerId>:batch:<batchIndex>"
 * Meta key:     "archive:<peerId>:meta"
 * Value:        JSON → Message[] (batch) | ArchiveMeta (meta)
 */
export const archiveStorage = createAsyncStorage('chat-archive');
