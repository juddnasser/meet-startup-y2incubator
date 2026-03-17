import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { ID, Query } from 'appwrite';
import Header from '../../header';
<<<<<<< Updated upstream
import { useChat } from './useChat';
=======
import { useChat } from '../../backend/chats/index';
import { client, tablesDB } from '../../backend/appwrite';
>>>>>>> Stashed changes

const DATABASE_ID = 'main';
const TABLE_ID = 'messages';

function createTransport(myId) {
  return {
    async send(peerId, message) {
      await tablesDB.createRow({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        rowId: ID.unique(),
        data: {
          sender_id: myId,
          receiver_id: peerId,
          sent_id: message.id,
          content: message.content,
        },
      });
    },

    onMessage(peerId, handler) {
      const unsubscribe = client.subscribe(
        `tablesdb.${DATABASE_ID}.tables.${TABLE_ID}.rows`,
        function (response) {
          const payload = response && response.payload ? response.payload : null;
          if (!payload) {
            return;
          }

          const isIncoming =
            payload.sender_id === peerId && payload.receiver_id === myId;

          const isOutgoingEcho =
            payload.sender_id === myId && payload.receiver_id === peerId;

          if (isIncoming || isOutgoingEcho) {
            handler(payload);
          }
        }
      );

      return unsubscribe;
    },
  };
}

export default function ChatPage() {
  const params = useLocalSearchParams();

  const [chatMeta, setChatMeta] = useState({
    peerId: 'unknown',
    peerName: 'Chat',
    peerTopic: 'Support chat',
    myId: 'me',
    myName: '',
  });

  useEffect(function () {
    setChatMeta({
      peerId: typeof params.peerId === 'string' ? params.peerId : 'unknown',
      peerName: typeof params.name === 'string' ? params.name : 'Chat',
      peerTopic: typeof params.topic === 'string' ? params.topic : 'Support chat',
      myId: typeof params.myId === 'string' && params.myId ? params.myId : 'me',
      myName: typeof params.myName === 'string' ? params.myName : '',
    });
  }, [params]);

  const transport = useMemo(function () {
    return createTransport(chatMeta.myId);
  }, [chatMeta.myId]);

  const [input, setInput] = useState('');
  const mode = 0;
  const isDark = mode === 0;

  const {
    messages,
    loading,
    hasOlderMessages,
    sendMessage,
    loadOlderMessages,
    syncFromAppwrite,
  } = useChat(chatMeta.peerId, chatMeta.myId, transport);

  useEffect(
    function () {
      let cancelled = false;

      async function hydrateConversation() {
        if (!chatMeta.peerId || !chatMeta.myId) {
          return;
        }

        try {
          const incomingPromise = tablesDB.listRows({
            databaseId: DATABASE_ID,
            tableId: TABLE_ID,
            queries: [
              Query.equal('sender_id', [chatMeta.peerId]),
              Query.equal('receiver_id', [chatMeta.myId]),
              Query.orderAsc('$createdAt'),
              Query.limit(500),
            ],
          });

          const outgoingPromise = tablesDB.listRows({
            databaseId: DATABASE_ID,
            tableId: TABLE_ID,
            queries: [
              Query.equal('sender_id', [chatMeta.myId]),
              Query.equal('receiver_id', [chatMeta.peerId]),
              Query.orderAsc('$createdAt'),
              Query.limit(500),
            ],
          });

          const results = await Promise.all([incomingPromise, outgoingPromise]);

          if (cancelled) {
            return;
          }

          const incomingRows =
            results[0] && Array.isArray(results[0].rows)
              ? results[0].rows
              : results[0] && Array.isArray(results[0].documents)
              ? results[0].documents
              : [];

          const outgoingRows =
            results[1] && Array.isArray(results[1].rows)
              ? results[1].rows
              : results[1] && Array.isArray(results[1].documents)
              ? results[1].documents
              : [];

          const merged = incomingRows.concat(outgoingRows).sort(function (a, b) {
            return new Date(a.$createdAt).getTime() - new Date(b.$createdAt).getTime();
          });

          await syncFromAppwrite(merged);
        } catch (error) {
          console.log('chat hydration error', error);
        }
      }

      hydrateConversation();

      return function () {
        cancelled = true;
      };
    },
    [chatMeta.peerId, chatMeta.myId, syncFromAppwrite]
  );

  const sortedMessages = useMemo(function () {
    return messages.slice().sort(function (a, b) {
      return a.dateSent - b.dateSent;
    });
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text) {
      return;
    }

    try {
      await sendMessage(text);
      setInput('');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={{
          uri: isDark
            ? 'https://static.vecteezy.com/system/resources/thumbnails/007/278/150/small_2x/dark-background-abstract-with-light-effect-vector.jpg'
            : 'https://images.ctfassets.net/nnkxuzam4k38/5uWJWkeNbfKj1xCb0QYw4W/5f98c1cf50300f106e1027609733e4cb/white-triangle.jpg',
        }}
        style={styles.background}
      >
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: isDark ? 'rgba(35,31,32,0.5)' : 'rgba(255,255,255,0.4)',
          }}
        />

        <Header mode={mode} />

        <View style={styles.page}>
          <View
            style={{
              flex: 1,
              borderRadius: 22,
              borderWidth: 1,
              overflow: 'hidden',
              backgroundColor: isDark ? 'rgba(32,44,89,0.92)' : '#ffffff',
              borderColor: '#3D8FB3',
            }}
          >
            <View
              style={{
                paddingHorizontal: 18,
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: '#3D8FB3',
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: '700',
                  color: isDark ? '#F4FAFF' : '#202C59',
                }}
              >
                {chatMeta.peerName}
              </Text>

              <Text
                style={{
                  fontSize: 13,
                  marginTop: 4,
                  color: isDark ? '#DEFFFE' : '#3D8FB3',
                }}
              >
                {chatMeta.peerTopic}
              </Text>
            </View>

            <ScrollView contentContainerStyle={styles.messagesArea}>
              {hasOlderMessages ? (
                <Pressable
                  onPress={loadOlderMessages}
                  style={{
                    alignSelf: 'center',
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: '#3D8FB3',
                    backgroundColor: isDark ? '#231F20' : '#FFFFFF',
                    marginBottom: 16,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: isDark ? '#F4FAFF' : '#202C59',
                    }}
                  >
                    Load older messages
                  </Text>
                </Pressable>
              ) : null}

              {loading ? (
                <Text
                  style={{
                    textAlign: 'center',
                    marginTop: 30,
                    color: isDark ? '#DEFFFE' : '#202C59',
                  }}
                >
                  Loading chat...
                </Text>
              ) : null}

              {!loading && sortedMessages.length === 0 ? (
                <Text
                  style={{
                    textAlign: 'center',
                    marginTop: 30,
                    color: isDark ? '#DEFFFE' : '#202C59',
                  }}
                >
                  No messages yet. Start the conversation.
                </Text>
              ) : null}

              {!loading &&
                sortedMessages.map(function (msg) {
                  return (
                    <View
                      key={msg.id}
                      style={[
                        styles.bubble,
                        {
                          alignSelf:
                            msg.direction === 'sent' ? 'flex-end' : 'flex-start',
                          backgroundColor:
                            msg.direction === 'sent'
                              ? '#3D8FB3'
                              : isDark
                              ? '#231F20'
                              : '#F4FAFF',
                          borderColor:
                            msg.direction === 'sent' ? '#FC9E4F' : '#3D8FB3',
                        },
                      ]}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          lineHeight: 22,
                          color:
                            msg.direction === 'sent'
                              ? '#F4FAFF'
                              : isDark
                              ? '#F4FAFF'
                              : '#202C59',
                        }}
                      >
                        {msg.content}
                      </Text>

                      {msg.edited ? (
                        <Text
                          style={{
                            fontSize: 11,
                            marginTop: 6,
                            color:
                              msg.direction === 'sent'
                                ? '#F4FAFF'
                                : isDark
                                ? '#DEFFFE'
                                : '#202C59',
                          }}
                        >
                          edited
                        </Text>
                      ) : null}
                    </View>
                  );
                })}
            </ScrollView>

            <View
              style={{
                flexDirection: 'row',
                padding: 14,
                borderTopWidth: 1,
                borderTopColor: '#3D8FB3',
                backgroundColor: isDark
                  ? 'rgba(35,31,32,0.2)'
                  : 'rgba(244,250,255,0.55)',
              }}
            >
              <TextInput
                value={input}
                onChangeText={setInput}
                onSubmitEditing={handleSend}
                placeholder="Write a message"
                placeholderTextColor={isDark ? '#8FA3B7' : '#6A7C8F'}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderRadius: 14,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  fontSize: 16,
                  marginRight: 10,
                  color: isDark ? '#F4FAFF' : '#202C59',
                  backgroundColor: isDark ? '#231F20' : '#FFFFFF',
                  borderColor: '#3D8FB3',
                }}
              />

              <Pressable
                onPress={handleSend}
                style={function ({ pressed }) {
                  return [
                    {
                      borderRadius: 14,
                      paddingHorizontal: 18,
                      justifyContent: 'center',
                      backgroundColor: '#FC9E4F',
                      opacity: pressed ? 0.92 : 1,
                    },
                  ];
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '700',
                    color: '#202C59',
                  }}
                >
                  Send
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  page: {
    flex: 1,
    paddingTop: 110,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  messagesArea: {
    padding: 16,
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
});