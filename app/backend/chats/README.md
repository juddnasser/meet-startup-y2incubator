# Chat Storage Layer

Backend storage system for a P2P chat app using AsyncStorage v3 and Appwrite.

---

## Installation

```bash
npx expo install @react-native-async-storage/async-storage
npx expo install expo-crypto
```

### Android — required extra step

AsyncStorage v3 ships its own local Maven repository. Without this, the Android
build will fail to resolve the native module.

Add the following inside `android/build.gradle` (the **project-level** file,
not the app-level one):

```groovy
allprojects {
  repositories {
    google()
    mavenCentral()

    // Required for AsyncStorage v3
    maven {
      url = uri(
        project(":react-native-async-storage_async-storage")
          .file("local_repo")
      )
    }
  }
}
```

### iOS

No extra steps. Run `pod install` inside the `ios/` directory as normal after
installing the package.

```bash
cd ios && pod install
```

---

## Platform notes

AsyncStorage v3 uses **SQLite** as the storage backend on both Android and iOS.
The library handles all platform differences internally — your application code
is identical on both platforms.

The one place explicit platform handling is needed is **UUID generation**
(`crypto.randomUUID()`), which is not available on older Android JSC engines.
`platform.js` resolves this automatically:

1. Tries `expo-crypto` (recommended, works everywhere)
2. Falls back to `crypto.randomUUID()` (safe on Hermes / RN 0.70+)
3. Last-resort polyfill for very old Android JSC environments

As long as `expo-crypto` is installed you never need to think about this.



## File Structure

```
storage/
├── instances.js   — createAsyncStorage database definitions
├── types.js       — JSDoc type definitions and constants
├── primary.js     — CRUD for the live 300-message primary storage
├── archive.js     — Archive batches for older messages
├── appwrite.js    — Appwrite row processing and ingestion
├── index.js       — Public API (import everything from here)
└── useChat.js     — React hook linking storage to the frontend
```

---

## How the Two-Storage System Works

```
                    Appwrite (server)
                         │
               loadInboundMessage()
                         │
                         ▼
              ┌─────────────────────┐
              │   primaryStorage    │  ← live 300 messages per peer
              │   "chat-primary"    │    (what the UI renders)
              └─────────────────────┘
                         │
              when msg 301 arrives:
              oldest message is evicted
                         │
                         ▼
              ┌─────────────────────┐
              │   archiveStorage    │  ← unlimited batches of 300
              │   "chat-archive"    │    loaded on scroll-up demand
              └─────────────────────┘
```

**Primary storage** always holds the most recent 300 messages for each peer. When a 301st message arrives, the oldest is automatically moved to the archive before the new one is written. The frontend renders primary by default.

**Archive storage** holds sealed batches of 300 messages, indexed 0 (oldest) upward. It grows without a cap. The frontend loads batches one at a time as the user scrolls up.

---

## Message Shape

```js
{
  id:        string,              // Appwrite sent_id
  senderId:  string,              // Appwrite sender_id
  content:   string,              // message text
  dateSent:  number,              // Unix ms — from Appwrite $createdAt
  direction: 'sent' | 'received', // relative to local user
  edited:    boolean,
  editedAt?: number,              // Unix ms, present if edited
}
```

---

## Appwrite Row Shape (input)

```js
{
  sender_id:  string,   // peer who sent it
  sent_id:    string,   // unique message ID
  content:    string,
  $createdAt: string,   // ISO 8601 e.g. "2026-03-12T10:00:00.000Z"
}
```

---

## Public API

### Primary CRUD (`primary.js`)

| Function | Description |
|---|---|
| `patchMessage(peerId, message)` | Appends a message; evicts oldest to archive if at 300 |
| `readMessages(peerId)` | Returns current primary messages (sorted oldest→newest) |
| `editMessage(peerId, messageId, newContent)` | Edits in primary, falls back to archive |
| `deleteMessage(peerId, messageId)` | Deletes from primary, falls back to archive |
| `deleteConversation(peerId)` | Wipes entire primary record for a peer |

### Archive (`archive.js`)

| Function | Description |
|---|---|
| `readArchiveBatch(peerId, batchIndex)` | Loads one batch (0 = oldest) |
| `getArchiveBatchCount(peerId)` | Total number of archive batches |
| `clearArchive(peerId)` | Deletes all archive data for a peer |

### Appwrite Processing (`appwrite.js`)

| Function | Description |
|---|---|
| `processAppwriteRow(row, myId)` | Transforms one row → Message (no storage write) |
| `loadInboundMessage(row, myId)` | Transform + patch one inbound message |
| `loadMessageBatch(rows, myId, peerId)` | Bulk transform + patch, sorted before write |
| `deduplicateRows(rows, existingMessages)` | Filters rows already in storage |

---

## Hook Usage

```js
import { useChat } from './storage/useChat';

const {
  messages,           // Message[] — rendered in the chat UI
  loading,            // boolean — show skeleton while true
  hasOlderMessages,   // boolean — show "load older" button while true
  sendMessage,        // (content: string) => void
  editMessage,        // (messageId: string, newContent: string) => void
  deleteMessage,      // (messageId: string) => void
  loadOlderMessages,  // () => void — call on scroll to top
  syncFromAppwrite,   // (rows: AppwriteRow[]) => void — call on initial connect
} = useChat(peerId, myId, p2pTransport);
```

### p2pTransport interface expected

```js
{
  send(peerId, message): Promise<void>,
  onMessage(peerId, handler): unsubscribeFn,
}
```

---

## Connecting Appwrite Realtime

```js
import { client, Databases } from './appwrite-client';  // your Appwrite setup
import { useChat } from './storage/useChat';

function ChatScreen({ peerId, myId }) {
  const { messages, sendMessage, syncFromAppwrite } = useChat(
    peerId,
    myId,
    p2pTransport
  );

  useEffect(() => {
    // Initial sync — load any messages received while offline
    const db = new Databases(client);
    db.listDocuments('your_db_id', 'messages_collection', [
      Query.equal('sender_id', peerId),
    ]).then((res) => syncFromAppwrite(res.documents));

    // Realtime subscription for live messages
    const unsub = client.subscribe(
      `databases.your_db_id.collections.messages_collection.documents`,
      (event) => {
        if (event.payload.sender_id === peerId) {
          // loadInboundMessage is called inside p2pTransport.onMessage handler
        }
      }
    );

    return unsub;
  }, [peerId]);
}
```
