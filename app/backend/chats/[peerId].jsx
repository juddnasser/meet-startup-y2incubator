import { BlurView } from 'expo-blur';
import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Header from '../../header';
import { useChat } from '../../index';

const transport = {
  async send(peerId, message) {
    console.log('send', peerId, message);
    return true;
  },
  onMessage(peerId, handler) {
    return () => {};
  },
};

export default function ChatPage() {
  const mode = 0;
  const styles = mode === 0 ? dark : light;

  const params = useLocalSearchParams();
  const peerId = params.peerId || 'demo-peer';
  const peerName = params.name || 'Conversation';

  const [input, setInput] = useState('');

  const {
    messages,
    loading,
    hasOlderMessages,
    sendMessage,
    loadOlderMessages,
  } = useChat(peerId, 'me', transport);

  const title = useMemo(() => String(peerName), [peerName]);

  async function handleSend() {
    const text = input.trim();
    if (!text) return;

    try {
      await sendMessage(text);
      setInput('');
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={{
          uri:
            mode === 0
              ? 'https://static.vecteezy.com/system/resources/thumbnails/007/278/150/small_2x/dark-background-abstract-with-light-effect-vector.jpg'
              : 'https://images.ctfassets.net/nnkxuzam4k38/5uWJWkeNbfKj1xCb0QYw4W/5f98c1cf50300f106e1027609733e4cb/white-triangle.jpg',
        }}
        style={styles.background}
        resizeMode="cover"
      >
        <BlurView
          intensity={40}
          tint={mode === 0 ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.overlay} />
        <Header mode={mode} />

        <KeyboardAvoidingView
          style={styles.page}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{title}</Text>
              <Text style={styles.cardSub}>
                Direct conversation
              </Text>
            </View>

            <ScrollView
              contentContainerStyle={styles.messagesWrap}
              keyboardShouldPersistTaps="handled"
            >
              {hasOlderMessages && (
                <Pressable style={styles.olderButton} onPress={loadOlderMessages}>
                  <Text style={styles.olderText}>Load older messages</Text>
                </Pressable>
              )}

              {loading ? (
                <Text style={styles.systemText}>Loading conversation...</Text>
              ) : messages.length === 0 ? (
                <Text style={styles.systemText}>No messages yet.</Text>
              ) : (
                messages.map((msg) => (
                  <View
                    key={msg.id}
                    style={[
                      styles.bubble,
                      msg.direction === 'sent'
                        ? styles.sentBubble
                        : styles.receivedBubble,
                    ]}
                  >
                    <Text style={styles.bubbleText}>{msg.content}</Text>
                    {msg.edited ? (
                      <Text style={styles.editedText}>edited</Text>
                    ) : null}
                  </View>
                ))
              )}
            </ScrollView>

            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Type a message"
                placeholderTextColor={mode === 0 ? '#94A3B8' : '#64748B'}
                value={input}
                onChangeText={setInput}
                onSubmitEditing={handleSend}
              />

              <Pressable
                style={({ pressed }) => [
                  styles.sendButton,
                  pressed && styles.sendButtonPressed,
                ]}
                onPress={handleSend}
              >
                <Text style={styles.sendText}>Send</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}

const base = {
  background: { flex: 1, width: '100%', height: '100%' },
  page: {
    flex: 1,
    paddingTop: 110,
    paddingBottom: 24,
    paddingHorizontal: 18,
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardHeader: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  cardSub: {
    marginTop: 4,
    fontSize: 13,
  },
  messagesWrap: {
    padding: 16,
  },
  olderButton: {
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  olderText: {
    fontSize: 14,
    fontWeight: '600',
  },
  systemText: {
    textAlign: 'center',
    fontSize: 15,
    marginTop: 30,
  },
  bubble: {
    maxWidth: '76%',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  sentBubble: {
    alignSelf: 'flex-end',
  },
  receivedBubble: {
    alignSelf: 'flex-start',
  },
  bubbleText: {
    fontSize: 16,
    lineHeight: 23,
  },
  editedText: {
    fontSize: 11,
    marginTop: 6,
    opacity: 0.75,
  },
  inputRow: {
    flexDirection: 'row',
    padding: 14,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 10,
  },
  sendButton: {
    borderRadius: 12,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  sendButtonPressed: {
    opacity: 0.92,
  },
  sendText: {
    fontSize: 16,
    fontWeight: '600',
  },
};

const dark = StyleSheet.create({
  ...base,
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(35, 31, 32, 0.45)',
  },
  card: {
    ...base.card,
    borderColor: '#3D8FB3',
    backgroundColor: 'rgba(32, 44, 89, 0.92)',
  },
  cardHeader: {
    ...base.cardHeader,
    borderBottomColor: '#3D8FB3',
  },
  cardTitle: { ...base.cardTitle, color: '#F4FAFF' },
  cardSub: { ...base.cardSub, color: '#DEFFFE' },
  olderButton: {
    ...base.olderButton,
    borderColor: '#3D8FB3',
    backgroundColor: '#231F20',
  },
  olderText: { ...base.olderText, color: '#F4FAFF' },
  systemText: { ...base.systemText, color: '#DEFFFE' },
  sentBubble: {
    ...base.sentBubble,
    backgroundColor: '#3D8FB3',
    borderColor: '#FC9E4F',
  },
  receivedBubble: {
    ...base.receivedBubble,
    backgroundColor: '#231F20',
    borderColor: '#3D8FB3',
  },
  bubbleText: { ...base.bubbleText, color: '#F4FAFF' },
  editedText: { ...base.editedText, color: '#F4FAFF' },
  inputRow: {
    ...base.inputRow,
    borderTopColor: '#3D8FB3',
    backgroundColor: 'rgba(35, 31, 32, 0.35)',
  },
  input: {
    ...base.input,
    color: '#F4FAFF',
    backgroundColor: '#231F20',
    borderColor: '#3D8FB3',
  },
  sendButton: {
    ...base.sendButton,
    backgroundColor: '#FC9E4F',
  },
  sendText: { ...base.sendText, color: '#202C59' },
});

const light = StyleSheet.create({
  ...base,
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(244, 250, 255, 0.28)',
  },
  card: {
    ...base.card,
    borderColor: '#3D8FB3',
    backgroundColor: 'rgba(255,255,255,0.94)',
  },
  cardHeader: {
    ...base.cardHeader,
    borderBottomColor: '#3D8FB3',
  },
  cardTitle: { ...base.cardTitle, color: '#202C59' },
  cardSub: { ...base.cardSub, color: '#3D8FB3' },
  olderButton: {
    ...base.olderButton,
    borderColor: '#3D8FB3',
    backgroundColor: '#FFFFFF',
  },
  olderText: { ...base.olderText, color: '#202C59' },
  systemText: { ...base.systemText, color: '#202C59' },
  sentBubble: {
    ...base.sentBubble,
    backgroundColor: '#3D8FB3',
    borderColor: '#FC9E4F',
  },
  receivedBubble: {
    ...base.receivedBubble,
    backgroundColor: '#F4FAFF',
    borderColor: '#3D8FB3',
  },
  bubbleText: { ...base.bubbleText, color: '#202C59' },
  editedText: { ...base.editedText, color: '#202C59' },
  inputRow: {
    ...base.inputRow,
    borderTopColor: '#3D8FB3',
    backgroundColor: 'rgba(244,250,255,0.6)',
  },
  input: {
    ...base.input,
    color: '#202C59',
    backgroundColor: '#FFFFFF',
    borderColor: '#3D8FB3',
  },
  sendButton: {
    ...base.sendButton,
    backgroundColor: '#FC9E4F',
  },
  sendText: { ...base.sendText, color: '#202C59' },
});