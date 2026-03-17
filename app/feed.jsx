import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Header from './header';
import { createPost } from './backend/feed';

export default function FeedPage() {
  const mode = 0;
  const styles = mode === 0 ? dark : light;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [busy, setBusy] = useState(false);

  const [posts, setPosts] = useState([
    {
      id: 'p1',
      title: 'Looking for advice on studies',
      content:
        'I want to start learning in a more open environment and I am looking for people who already made that move.',
      author: 'Anonymous',
      tag: 'Education',
    },
    {
      id: 'p2',
      title: 'First steps into work',
      content:
        'If anyone here entered the job market after a big change in life, I would really appreciate practical advice.',
      author: 'Anonymous',
      tag: 'Work',
    },
  ]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  async function handlePublish() {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Missing details', 'Please write a title and some content.');
      return;
    }

    try {
      setBusy(true);

      const ok = await createPost(
        {
          title: title.trim(),
          content: content.trim(),
        },
        'demo-user'
      );

      if (ok === false) {
        throw new Error('Post failed');
      }

      setPosts((prev) => [
        {
          id: String(Date.now()),
          title: title.trim(),
          content: content.trim(),
          author: 'You',
          tag: 'New',
        },
        ...prev,
      ]);

      setTitle('');
      setContent('');
    } catch (err) {
      console.error(err);
      Alert.alert('Could not publish', 'The post was not saved.');
    } finally {
      setBusy(false);
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

        <ScrollView contentContainerStyle={styles.page}>
          <View style={styles.topRow}>
            <View>
              <Text style={styles.pageTitle}>{greeting}</Text>
              <Text style={styles.pageSubtitle}>
                Community posts, questions, and helpful conversations.
              </Text>
            </View>

            <View style={styles.quickRow}>
              <Pressable
                style={styles.quickButton}
                onPress={() => router.push('/messages')}
              >
                <Text style={styles.quickButtonText}>Messages</Text>
              </Pressable>

              <Pressable
                style={styles.quickButton}
                onPress={() => router.push('/profile')}
              >
                <Text style={styles.quickButtonText}>Profile</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.composeBox}>
            <Text style={styles.composeTitle}>Write something</Text>

            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Title"
              placeholderTextColor={mode === 0 ? '#94A3B8' : '#64748B'}
            />

            <TextInput
              style={[styles.input, styles.textarea]}
              value={content}
              onChangeText={setContent}
              multiline
              placeholder="Share a question, a story, or a request for help"
              placeholderTextColor={mode === 0 ? '#94A3B8' : '#64748B'}
            />

            <Pressable
              style={({ pressed }) => [
                styles.publishButton,
                pressed && styles.publishButtonPressed,
              ]}
              onPress={handlePublish}
              disabled={busy}
            >
              <Text style={styles.publishText}>
                {busy ? 'Publishing...' : 'Publish'}
              </Text>
            </Pressable>
          </View>

          <View style={styles.list}>
            {posts.map((post) => (
              <View key={post.id} style={styles.postCard}>
                <View style={styles.cardTop}>
                  <Text style={styles.tag}>{post.tag}</Text>
                  <Text style={styles.author}>By {post.author}</Text>
                </View>

                <Text style={styles.postTitle}>{post.title}</Text>
                <Text style={styles.postBody}>{post.content}</Text>

                <View style={styles.cardActions}>
                  <Pressable
                    style={styles.secondaryButton}
                    onPress={() =>
                      router.push({
                        pathname: '/chat/[peerId]',
                        params: { peerId: 'demo-peer' },
                      })
                    }
                  >
                    <Text style={styles.secondaryButtonText}>Message</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const base = {
  background: { flex: 1, width: '100%', height: '100%' },
  page: {
    paddingTop: 120,
    paddingBottom: 40,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  topRow: {
    width: '100%',
    maxWidth: 920,
    marginBottom: 18,
  },
  pageTitle: {
    fontSize: 36,
    fontWeight: '700',
  },
  pageSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 6,
  },
  quickRow: {
    flexDirection: 'row',
    marginTop: 14,
  },
  quickButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 11,
    marginRight: 10,
  },
  quickButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  composeBox: {
    width: '100%',
    maxWidth: 920,
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
  },
  composeTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 14,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 14,
  },
  textarea: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  publishButton: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: 22,
    paddingVertical: 14,
  },
  publishButtonPressed: {
    opacity: 0.92,
  },
  publishText: {
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    width: '100%',
    maxWidth: 920,
  },
  postCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tag: {
    fontSize: 13,
    fontWeight: '700',
  },
  author: {
    fontSize: 13,
  },
  postTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
  },
  postBody: {
    fontSize: 16,
    lineHeight: 24,
  },
  cardActions: {
    flexDirection: 'row',
    marginTop: 18,
  },
  secondaryButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
};

const dark = StyleSheet.create({
  ...base,
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(35, 31, 32, 0.45)',
  },
  pageTitle: { ...base.pageTitle, color: '#F4FAFF' },
  pageSubtitle: { ...base.pageSubtitle, color: '#DEFFFE' },
  quickButton: {
    ...base.quickButton,
    borderColor: '#3D8FB3',
    backgroundColor: 'rgba(32, 44, 89, 0.55)',
  },
  quickButtonText: { ...base.quickButtonText, color: '#F4FAFF' },
  composeBox: {
    ...base.composeBox,
    borderColor: '#3D8FB3',
    backgroundColor: 'rgba(32, 44, 89, 0.9)',
  },
  composeTitle: { ...base.composeTitle, color: '#F4FAFF' },
  input: {
    ...base.input,
    color: '#F4FAFF',
    backgroundColor: '#231F20',
    borderColor: '#3D8FB3',
  },
  textarea: base.textarea,
  publishButton: {
    ...base.publishButton,
    backgroundColor: '#FC9E4F',
  },
  publishText: { ...base.publishText, color: '#202C59' },
  postCard: {
    ...base.postCard,
    borderColor: '#3D8FB3',
    backgroundColor: 'rgba(32, 44, 89, 0.9)',
  },
  tag: { ...base.tag, color: '#FC9E4F' },
  author: { ...base.author, color: '#DEFFFE' },
  postTitle: { ...base.postTitle, color: '#F4FAFF' },
  postBody: { ...base.postBody, color: '#DEFFFE' },
  secondaryButton: {
    ...base.secondaryButton,
    borderColor: '#3D8FB3',
    backgroundColor: '#231F20',
  },
  secondaryButtonText: { ...base.secondaryButtonText, color: '#F4FAFF' },
});

const light = StyleSheet.create({
  ...base,
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(244, 250, 255, 0.28)',
  },
  pageTitle: { ...base.pageTitle, color: '#202C59' },
  pageSubtitle: { ...base.pageSubtitle, color: '#202C59' },
  quickButton: {
    ...base.quickButton,
    borderColor: '#3D8FB3',
    backgroundColor: 'rgba(255,255,255,0.88)',
  },
  quickButtonText: { ...base.quickButtonText, color: '#202C59' },
  composeBox: {
    ...base.composeBox,
    borderColor: '#3D8FB3',
    backgroundColor: 'rgba(244, 250, 255, 0.95)',
  },
  composeTitle: { ...base.composeTitle, color: '#202C59' },
  input: {
    ...base.input,
    color: '#202C59',
    backgroundColor: '#FFFFFF',
    borderColor: '#3D8FB3',
  },
  textarea: base.textarea,
  publishButton: {
    ...base.publishButton,
    backgroundColor: '#FC9E4F',
  },
  publishText: { ...base.publishText, color: '#202C59' },
  postCard: {
    ...base.postCard,
    borderColor: '#3D8FB3',
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  tag: { ...base.tag, color: '#202C59' },
  author: { ...base.author, color: '#3D8FB3' },
  postTitle: { ...base.postTitle, color: '#202C59' },
  postBody: { ...base.postBody, color: '#202C59' },
  secondaryButton: {
    ...base.secondaryButton,
    borderColor: '#3D8FB3',
    backgroundColor: '#FFFFFF',
  },
  secondaryButtonText: { ...base.secondaryButtonText, color: '#202C59' },
});