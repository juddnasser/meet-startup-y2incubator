import { BlurView } from 'expo-blur';
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

const SUPPORT_TYPES = [
  'Financial Support',
  'Emotional Support',
  'Mentorship',
  'Professional Advice',
  'Other',
];

export default function HomePage() {
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

  const welcomeName =
    profile.name && profile.name.trim() ? profile.name.trim() : 'Welcome back';

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
      <ImageBackground
        source={{
          uri: isDark
            ? 'https://static.vecteezy.com/system/resources/thumbnails/007/278/150/small_2x/dark-background-abstract-with-light-effect-vector.jpg'
            : 'https://images.ctfassets.net/nnkxuzam4k38/5uWJWkeNbfKj1xCb0QYw4W/5f98c1cf50300f106e1027609733e4cb/white-triangle.jpg',
        }}
        style={styles.hero}
        resizeMode="cover"
      >
        <BlurView
          intensity={40}
          tint={isDark ? 'dark' : 'light'}
          style={styles.fill}
        />
        <View style={styles.overlay} />
        <Header mode={mode} />

        <View style={styles.heroInner}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroTitle}>{welcomeName}</Text>
            <Text style={styles.heroSubtitle}>
look for support, or
              continue your conversations.
            </Text>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.section}>
        <View style={styles.quickActions}>
          <Pressable
            style={function ({ pressed }) {
              return [styles.actionCard, pressed ? styles.buttonPressed : null];
            }}
            onPress={function () {
              router.push({
                pathname: '/profile',
                params: profile,
              });
            }}
          >
            <Text style={styles.actionTitle}>My Profile</Text>
            <Text style={styles.actionText}>
              Edit your details, your description, and your support preferences.
            </Text>
          </Pressable>

          <Pressable
            style={function ({ pressed }) {
              return [styles.actionCard, pressed ? styles.buttonPressed : null];
            }}
            onPress={function () {
              router.push({
                pathname: '/messages',
                params: profile,
              });
            }}
          >
            <Text style={styles.actionTitle}>Messages</Text>
            <Text style={styles.actionText}>
              Read ongoing conversations and continue where you left off.
            </Text>
          </Pressable>

          <Pressable
            style={function ({ pressed }) {
              return [styles.actionCard, pressed ? styles.buttonPressed : null];
            }}
            onPress={function () {
              router.push({
                pathname: '/feed',
                params: profile,
              });
            }}
          >
            <Text style={styles.actionTitle}>Find Support</Text>
            <Text style={styles.actionText}>
              Browse people and communities that can help with the next step.
            </Text>
          </Pressable>
        </View>

        <View style={styles.divider} />

        <View style={styles.block}>
          <Text style={styles.sectionTitle}>Support types</Text>
          <Text style={styles.sectionText}>
            These are the main areas users can ask for help in or contribute to.
          </Text>
        </View>

        <View style={styles.supportGrid}>
          {SUPPORT_TYPES.map(function (item) {
            return (
              <View key={item} style={styles.supportCard}>
                <Text style={styles.supportCardText}>{item}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const dark = StyleSheet.create({
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  hero: {
    minHeight: 420,
    width: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(35,31,32,0.45)',
  },
  heroInner: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 110,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  heroCopy: {
    maxWidth: 760,
  },
  heroTitle: {
    fontSize: 40,
    fontWeight: '800',
    color: '#F4FAFF',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 17,
    lineHeight: 26,
    color: '#DEFFFE',
    maxWidth: 650,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 28,
    backgroundColor: '#161B2E',
  },
  quickActions: {
    gap: 14,
  },
  actionCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 20,
    backgroundColor: 'rgba(32,44,89,0.9)',
    borderColor: '#3D8FB3',
  },
  actionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F4FAFF',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 15,
    lineHeight: 23,
    color: '#DEFFFE',
  },
  buttonPressed: {
    opacity: 0.92,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(61,143,179,0.4)',
    marginVertical: 24,
  },
  block: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F4FAFF',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#DEFFFE',
  },
  supportGrid: {
    gap: 12,
  },
  supportCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    backgroundColor: '#231F20',
    borderColor: '#3D8FB3',
  },
  supportCardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F4FAFF',
  },
});

const light = StyleSheet.create({
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  hero: {
    minHeight: 420,
    width: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(244,250,255,0.28)',
  },
  heroInner: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 110,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  heroCopy: {
    maxWidth: 760,
  },
  heroTitle: {
    fontSize: 40,
    fontWeight: '800',
    color: '#202C59',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 17,
    lineHeight: 26,
    color: '#202C59',
    maxWidth: 650,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 28,
    backgroundColor: '#F6FAFF',
  },
  quickActions: {
    gap: 14,
  },
  actionCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderColor: '#3D8FB3',
  },
  actionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#202C59',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 15,
    lineHeight: 23,
    color: '#202C59',
  },
  buttonPressed: {
    opacity: 0.92,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(61,143,179,0.4)',
    marginVertical: 24,
  },
  block: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#202C59',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#202C59',
  },
  supportGrid: {
    gap: 12,
  },
  supportCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderColor: '#3D8FB3',
  },
  supportCardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202C59',
  },
});