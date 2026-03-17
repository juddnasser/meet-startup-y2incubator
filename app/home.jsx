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

const SUPPORT_TYPES = [
  'Financial Support',
  'Emotional Support',
  'Mentorship',
  'Professional Advice',
  'Other',
];

export default function HomePage() {
  const mode = 0;
  const styles = mode === 0 ? dark : light;

  const imageUri =
    mode === 0
      ? 'https://static.vecteezy.com/system/resources/thumbnails/007/278/150/small_2x/dark-background-abstract-with-light-effect-vector.jpg'
      : 'https://images.ctfassets.net/nnkxuzam4k38/5uWJWkeNbfKj1xCb0QYw4W/5f98c1cf50300f106e1027609733e4cb/white-triangle.jpg';

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
      <ImageBackground
        source={{ uri: imageUri }}
        style={styles.hero}
        resizeMode="cover"
      >
        <BlurView
          intensity={40}
          tint={mode === 0 ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.overlay} />
        <Header mode={mode} />

        <View style={styles.heroInner}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroTitle}>Welcome back</Text>
            <Text style={styles.heroSubtitle}>
              Choose your next step: update your profile, look for support, or
              continue your conversations.
            </Text>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.section}>
        <View style={styles.quickActions}>
          <Pressable
            style={({ pressed }) => [
              styles.actionCard,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push('/profile')}
          >
            <Text style={styles.actionTitle}>My Profile</Text>
            <Text style={styles.actionText}>
              Edit your details, your description, and your support preferences.
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionCard,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push('/messages')}
          >
            <Text style={styles.actionTitle}>Messages</Text>
            <Text style={styles.actionText}>
              Read ongoing conversations and continue where you left off.
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionCard,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push('/signup')}
          >
            <Text style={styles.actionTitle}>Support Preferences</Text>
            <Text style={styles.actionText}>
              Update the kinds of support you need or the help you can offer.
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
          {SUPPORT_TYPES.map((item) => (
            <View key={item} style={styles.supportCard}>
              <Text style={styles.supportCardText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        <View style={styles.block}>
          <Text style={styles.sectionTitle}>Next screens to build</Text>
          <Text style={styles.sectionText}>
            After this, the right product screens are browse/matching, profile
            detail, and polished chat.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const base = {
  hero: {
    minHeight: 420,
    width: '100%',
  },
  heroInner: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingTop: 130,
    paddingBottom: 50,
    paddingHorizontal: 24,
  },
  heroCopy: {
    width: '100%',
    maxWidth: 980,
    alignSelf: 'center',
  },
  heroTitle: {
    fontSize: 52,
    fontWeight: '800',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 20,
    lineHeight: 31,
    maxWidth: 800,
  },
  section: {
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 50,
  },
  quickActions: {
    width: '100%',
    maxWidth: 1080,
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  actionCard: {
    flexGrow: 1,
    flexBasis: 280,
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    minHeight: 180,
  },
  actionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
  },
  actionText: {
    fontSize: 16,
    lineHeight: 26,
  },
  divider: {
    width: '100%',
    maxWidth: 1080,
    alignSelf: 'center',
    height: 1,
    marginVertical: 28,
  },
  block: {
    width: '100%',
    maxWidth: 1080,
    alignSelf: 'center',
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 34,
    fontWeight: '800',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 18,
    lineHeight: 30,
    maxWidth: 900,
  },
  supportGrid: {
    width: '100%',
    maxWidth: 1080,
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  supportCard: {
    flexGrow: 1,
    flexBasis: 190,
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  supportCardText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  buttonPressed: {
    opacity: 0.92,
  },
};

const dark = StyleSheet.create({
  ...base,
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(35, 31, 32, 0.45)',
  },
  heroTitle: { ...base.heroTitle, color: '#F4FAFF' },
  heroSubtitle: { ...base.heroSubtitle, color: '#DEFFFE' },
  section: { ...base.section, backgroundColor: '#231F20' },
  actionCard: {
    ...base.actionCard,
    backgroundColor: 'rgba(32, 44, 89, 0.88)',
    borderColor: '#3D8FB3',
  },
  actionTitle: { ...base.actionTitle, color: '#F4FAFF' },
  actionText: { ...base.actionText, color: '#DEFFFE' },
  divider: { ...base.divider, backgroundColor: 'rgba(61, 143, 179, 0.45)' },
  sectionTitle: { ...base.sectionTitle, color: '#F4FAFF' },
  sectionText: { ...base.sectionText, color: '#DEFFFE' },
  supportCard: {
    ...base.supportCard,
    backgroundColor: 'rgba(32, 44, 89, 0.88)',
    borderColor: '#3D8FB3',
  },
  supportCardText: { ...base.supportCardText, color: '#F4FAFF' },
});

const light = StyleSheet.create({
  ...base,
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(244, 250, 255, 0.28)',
  },
  heroTitle: { ...base.heroTitle, color: '#202C59' },
  heroSubtitle: { ...base.heroSubtitle, color: '#202C59' },
  section: { ...base.section, backgroundColor: '#F4FAFF' },
  actionCard: {
    ...base.actionCard,
    backgroundColor: '#FFFFFF',
    borderColor: '#3D8FB3',
  },
  actionTitle: { ...base.actionTitle, color: '#202C59' },
  actionText: { ...base.actionText, color: '#202C59' },
  divider: { ...base.divider, backgroundColor: 'rgba(61, 143, 179, 0.35)' },
  sectionTitle: { ...base.sectionTitle, color: '#202C59' },
  sectionText: { ...base.sectionText, color: '#202C59' },
  supportCard: {
    ...base.supportCard,
    backgroundColor: '#FFFFFF',
    borderColor: '#3D8FB3',
  },
  supportCardText: { ...base.supportCardText, color: '#202C59' },
});