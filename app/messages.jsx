import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Header from './header';

const conversations = [
  {
    id: 'mentor-1',
    name: 'Rivka',
    preview: 'I can help with the first steps into studies.',
  },
  {
    id: 'mentor-2',
    name: 'David',
    preview: 'Happy to talk about work and practical next steps.',
  },
  {
    id: 'mentor-3',
    name: 'Yael',
    preview: 'You are not alone in this process.',
  },
];

export default function MessagesPage() {
  const mode = 0;
  const styles = mode === 0 ? dark : light;

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
          <Text style={styles.title}>Messages</Text>

          {conversations.map((item) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [
                styles.row,
                pressed && styles.rowPressed,
              ]}
              onPress={() =>
                router.push({
                  pathname: '/chat/[peerId]',
                  params: { peerId: item.id, name: item.name },
                })
              }
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.name[0]}</Text>
              </View>

              <View style={styles.textWrap}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.preview}>{item.preview}</Text>
              </View>
            </Pressable>
          ))}
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
  title: {
    width: '100%',
    maxWidth: 760,
    fontSize: 34,
    fontWeight: '700',
    marginBottom: 18,
  },
  row: {
    width: '100%',
    maxWidth: 760,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowPressed: {
    opacity: 0.95,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
  },
  textWrap: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  preview: {
    fontSize: 14,
    lineHeight: 21,
  },
};

const dark = StyleSheet.create({
  ...base,
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(35, 31, 32, 0.45)',
  },
  title: { ...base.title, color: '#F4FAFF' },
  row: {
    ...base.row,
    borderColor: '#3D8FB3',
    backgroundColor: 'rgba(32, 44, 89, 0.9)',
  },
  avatar: {
    ...base.avatar,
    backgroundColor: '#231F20',
    borderWidth: 1,
    borderColor: '#3D8FB3',
  },
  avatarText: { ...base.avatarText, color: '#FC9E4F' },
  name: { ...base.name, color: '#F4FAFF' },
  preview: { ...base.preview, color: '#DEFFFE' },
});

const light = StyleSheet.create({
  ...base,
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(244, 250, 255, 0.28)',
  },
  title: { ...base.title, color: '#202C59' },
  row: {
    ...base.row,
    borderColor: '#3D8FB3',
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  avatar: {
    ...base.avatar,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#3D8FB3',
  },
  avatarText: { ...base.avatarText, color: '#202C59' },
  name: { ...base.name, color: '#202C59' },
  preview: { ...base.preview, color: '#3D8FB3' },
});