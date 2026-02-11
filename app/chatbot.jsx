import { Client } from "@gradio/client";
import { BlurView } from 'expo-blur';
import { useState } from 'react';
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Header from './header';




async function getReply(msg = "") {
    const client = await Client.connect("MiniMaxAI/MiniMax-Text-01");
    const result = await client.predict("/chat", {
        message: msg,
        max_tokens: 15000,
        temperature: 0.7,
        top_p: 0.9,
    });
    return result.data;
}

export default function ChatbotPage() {

    let mode = 0; // 0 = dark, 1 = light
    let stylesChat = [stylesChatDark, stylesChatLight];
    const styles = stylesChat[mode];

    const [messages, setMessages] = useState([
        { id: 1, from: 'bot', text: 'Hello 👋 How can I help you today?' },
    ]);
    const [input, setInput] = useState('');

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), from: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // placeholder (replace with real call when ready)
        const reply = getReply(userMsg.text)

        setMessages(prev => [
            ...prev,
            { id: Date.now() + 1, from: 'bot', text: reply },
        ]);
    };

    return (
        <View style={{ flex: 1 }}>
            <ImageBackground
                source={{
                    uri: mode === 0
                        ? 'https://static.vecteezy.com/system/resources/thumbnails/007/278/150/small_2x/dark-background-abstract-with-light-effect-vector.jpg'
                        : 'https://images.ctfassets.net/nnkxuzam4k38/5uWJWkeNbfKj1xCb0QYw4W/5f98c1cf50300f106e1027609733e4cb/white-triangle.jpg'
                }}
                style={styles.background}
                resizeMode="cover"
            >
                <BlurView intensity={40} tint={mode === 0 ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                <View style={styles.overlay} />

                <Header mode={mode} />

                {/* Chat */}
                <View style={styles.chatWrapper}>
                    <ScrollView
                        contentContainerStyle={styles.messagesContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        {messages.map(msg => (
                            <View
                                key={msg.id}
                                style={[
                                    styles.messageBubble,
                                    msg.from === 'user' ? styles.userBubble : styles.botBubble,
                                ]}
                            >
                                <Text style={styles.messageText}>{msg.text}</Text>
                            </View>
                        ))}
                    </ScrollView>

                    <View style={styles.inputBar}>
                        <TextInput
                            value={input}
                            onChangeText={setInput}
                            placeholder="Type your message…"
                            placeholderTextColor={mode === 0 ? '#94A3B8' : '#64748B'}
                            style={styles.input}
                        />
                        <Pressable onPress={sendMessage} style={styles.sendButton}>
                            <Text style={styles.sendText}>Send</Text>
                        </Pressable>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}


const stylesChatDark = StyleSheet.create({
    background: { flex: 1, width: '100%', height: '100%' },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },

    chatWrapper: { flex: 1, marginTop: 140, marginHorizontal: 200, marginBottom: 60, borderRadius: 20, backgroundColor: 'rgba(2,6,23,0.85)', overflow: 'hidden' },
    messagesContainer: { padding: 30 },

    messageBubble: { maxWidth: '70%', padding: 18, borderRadius: 16, marginBottom: 16 },
    botBubble: { backgroundColor: '#020617', alignSelf: 'flex-start', borderWidth: 1, borderColor: '#1E3A8A' },
    userBubble: { backgroundColor: '#1E40AF', alignSelf: 'flex-end' },
    messageText: { color: '#FFFFFF', fontSize: 18, lineHeight: 26 },

    inputBar: { flexDirection: 'row', alignItems: 'center', padding: 20, borderTopWidth: 1, borderColor: '#1E3A8A' },
    input: { flex: 1, fontSize: 18, color: '#FFFFFF', paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#020617', borderRadius: 12, borderWidth: 1, borderColor: '#1E3A8A' },
    sendButton: { marginLeft: 16, paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, backgroundColor: '#2563EB' },
    sendText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
});
const stylesChatLight = StyleSheet.create({
    background: { flex: 1, width: '100%', height: '100%' },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.35)' },

    chatWrapper: { flex: 1, marginTop: 140, marginHorizontal: 200, marginBottom: 60, borderRadius: 20, backgroundColor: 'rgba(248,250,252,0.9)', overflow: 'hidden' },
    messagesContainer: { padding: 30 },

    messageBubble: { maxWidth: '70%', padding: 18, borderRadius: 16, marginBottom: 16 },
    botBubble: { backgroundColor: '#FFFFFF', alignSelf: 'flex-start', borderWidth: 1, borderColor: '#CBD5E1' },
    userBubble: { backgroundColor: '#2563EB', alignSelf: 'flex-end' },
    messageText: { color: '#020617', fontSize: 18, lineHeight: 26 },

    inputBar: { flexDirection: 'row', alignItems: 'center', padding: 20, borderTopWidth: 1, borderColor: '#CBD5E1' },
    input: { flex: 1, fontSize: 18, color: '#020617', paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#CBD5E1' },
    sendButton: { marginLeft: 16, paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, backgroundColor: '#2563EB' },
    sendText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
});
