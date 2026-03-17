import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Header from './header';

const conversationsSeed = [
  {
    id: 'rivka',
    name: 'Rivka Cohen',
    topic: 'Emotional Support',
    preview: 'I am here if you want to talk through what is happening.',
    unread: true,
  },
  {
    id: 'daniel',
    name: 'Daniel Levi',
    topic: 'Professional Advice',
    preview: 'Send me your CV and I will review it with you.',
    unread: false,
  },
  {
    id: 'miriam',
    name: 'Miriam Ezra',
    topic: 'Mentorship',
    preview: 'We can take this one step at a time and build a plan.',
    unread: false,
  },
];

export default function MessagesPage() {
  const params = useLocalSearchParams();
  const mode = 0;
  const isDark = mode === 0;
  const styles = isDark ? dark : light;

  const [profile, setProfile] = useState({
    id: '',
    email: '',
    name: '',
    age: '',
    description: '',
    role: '',
    pfp: '0',
  });

  useEffect(function () {
    setProfile({
      id: typeof params.id === 'string' ? params.id : '',
      email: typeof params.email === 'string' ? params.email : '',
      name: typeof params.name === 'string' ? params.name : '',
      age: typeof params.age === 'string' ? params.age : '',
      description: typeof params.description === 'string' ? params.description : '',
      role: typeof params.role === 'string' ? params.role : '',
      pfp: typeof params.pfp === 'string' ? params.pfp : '0',
    });
  }, [params]);

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
        <View style={styles.overlay} />
        <Header mode={mode} />

        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.top}>
            <Text style={styles.pageTitle}>Messages</Text>
            <Text style={styles.pageSubtitle}>
              Continue your conversations with people who support you.
            </Text>
          </View>

          {conversationsSeed.map(function (item) {
            return (
              <Pressable
                key={item.id}
                onPress={function () {
                  router.push({
                    pathname: 'backend/chats/[peerId]',
                    params: {
                      peerId: item.id,
                      name: item.name,
                      topic: item.topic,
                      myId: profile.id,
                      myName: profile.name,
                      myEmail: profile.email,
                    },
                  });
                }}
                style={function ({ pressed }) {
                  return [styles.card, pressed ? styles.cardPressed : null];
                }}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{item.name[0]}</Text>
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.rowTop}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    {item.unread ? <View style={styles.unreadDot} /> : null}
                  </View>

                  <Text style={styles.cardTopic}>{item.topic}</Text>
                  <Text style={styles.cardPreview}>{item.preview}</Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const dark = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(35,31,32,0.5)',
  },
  container: {
    paddingTop: 120,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  top: {
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
    color: '#F4FAFF',
  },
  pageSubtitle: {
    fontSize: 15,
    color: '#DEFFFE',
  },
  card: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(32,44,89,0.9)',
    borderColor: '#3D8FB3',
  },
  cardPressed: {
    opacity: 0.9,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#231F20',
    borderWidth: 1,
    borderColor: '#3D8FB3',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FC9E4F',
  },
  cardBody: {
    flex: 1,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F4FAFF',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: '#FC9E4F',
  },
  cardTopic: {
    fontSize: 13,
    marginBottom: 6,
    color: '#DEFFFE',
  },
  cardPreview: {
    fontSize: 14,
    color: '#F4FAFF',
  },
});

const light = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  container: {
    paddingTop: 120,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  top: {
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
    color: '#202C59',
  },
  pageSubtitle: {
    fontSize: 15,
    color: '#202C59',
  },
  card: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#3D8FB3',
  },
  cardPressed: {
    opacity: 0.9,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#F4FAFF',
    borderWidth: 1,
    borderColor: '#3D8FB3',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#202C59',
  },
  cardBody: {
    flex: 1,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#202C59',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: '#FC9E4F',
  },
  cardTopic: {
    fontSize: 13,
    marginBottom: 6,
    color: '#3D8FB3',
  },
  cardPreview: {
    fontSize: 14,
    color: '#202C59',
  },
});