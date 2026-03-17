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

export default function LandingPage() {
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
            <Text style={styles.heroTitle}>Hidush</Text>
            <Text style={styles.heroSubtitle}>
              A place for Haredi users to find support, guidance, and real
              people who can help with the next step.
            </Text>

            <View style={styles.heroActions}>
              <Pressable
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() => router.push('/signup')}
              >
                <Text style={styles.primaryButtonText}>Sign Up</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.secondaryButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() => router.push('/login')}
              >
                <Text style={styles.secondaryButtonText}>Log In</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.section}>
        <View style={styles.block}>
          <Text style={styles.sectionTitle}>What kind of support?</Text>
          <Text style={styles.sectionText}>
            Users can look for support or offer support in the areas that matter
            most.
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
          <Text style={styles.sectionTitle}>How it works</Text>
          <View style={styles.stepsRow}>
            <View style={styles.stepCard}>
              <Text style={styles.stepNumber}>1</Text>
              <Text style={styles.stepTitle}>Create a profile</Text>
              <Text style={styles.stepText}>
                Share who you are and what kind of support you need or offer.
              </Text>
            </View>

            <View style={styles.stepCard}>
              <Text style={styles.stepNumber}>2</Text>
              <Text style={styles.stepTitle}>Choose support types</Text>
              <Text style={styles.stepText}>
                Select the areas that are relevant to your path.
              </Text>
            </View>

            <View style={styles.stepCard}>
              <Text style={styles.stepNumber}>3</Text>
              <Text style={styles.stepTitle}>Connect with people</Text>
              <Text style={styles.stepText}>
                Browse profiles, find a match, and start a conversation.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const base = {
  hero: {
    minHeight: 760,
    width: '100%',
  },
  heroInner: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 140,
    paddingBottom: 120,
    paddingHorizontal: 24,
  },
  heroCopy: {
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
  },
  heroTitle: {
    fontSize: 74,
    fontWeight: '800',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 22,
    lineHeight: 34,
    maxWidth: 700,
    marginBottom: 28,
  },
  heroActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  primaryButton: {
    borderRadius: 14,
    paddingHorizontal: 22,
    paddingVertical: 16,
  },
  secondaryButton: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 22,
    paddingVertical: 16,
  },
  buttonPressed: {
    opacity: 0.92,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '700',
  },
  secondaryButtonText: {
    fontSize: 17,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 22,
    paddingTop: 34,
    paddingBottom: 50,
  },
  block: {
    width: '100%',
    maxWidth: 1080,
    alignSelf: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 40,
    fontWeight: '800',
    marginBottom: 14,
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
  divider: {
    width: '100%',
    maxWidth: 1080,
    alignSelf: 'center',
    height: 1,
    marginVertical: 34,
  },
  stepsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  stepCard: {
    flexGrow: 1,
    flexBasis: 280,
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    minHeight: 210,
  },
  stepNumber: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 10,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
  },
  stepText: {
    fontSize: 16,
    lineHeight: 26,
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
  primaryButton: { ...base.primaryButton, backgroundColor: '#FC9E4F' },
  secondaryButton: {
    ...base.secondaryButton,
    backgroundColor: 'rgba(32, 44, 89, 0.58)',
    borderColor: '#3D8FB3',
  },
  primaryButtonText: { ...base.primaryButtonText, color: '#202C59' },
  secondaryButtonText: { ...base.secondaryButtonText, color: '#F4FAFF' },
  section: { ...base.section, backgroundColor: '#231F20' },
  sectionTitle: { ...base.sectionTitle, color: '#F4FAFF' },
  sectionText: { ...base.sectionText, color: '#DEFFFE' },
  supportCard: {
    ...base.supportCard,
    backgroundColor: 'rgba(32, 44, 89, 0.88)',
    borderColor: '#3D8FB3',
  },
  supportCardText: { ...base.supportCardText, color: '#F4FAFF' },
  divider: { ...base.divider, backgroundColor: 'rgba(61, 143, 179, 0.45)' },
  stepCard: {
    ...base.stepCard,
    backgroundColor: 'rgba(32, 44, 89, 0.88)',
    borderColor: '#3D8FB3',
  },
  stepNumber: { ...base.stepNumber, color: '#FC9E4F' },
  stepTitle: { ...base.stepTitle, color: '#F4FAFF' },
  stepText: { ...base.stepText, color: '#DEFFFE' },
});

const light = StyleSheet.create({
  ...base,
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(244, 250, 255, 0.28)',
  },
  heroTitle: { ...base.heroTitle, color: '#202C59' },
  heroSubtitle: { ...base.heroSubtitle, color: '#202C59' },
  primaryButton: { ...base.primaryButton, backgroundColor: '#FC9E4F' },
  secondaryButton: {
    ...base.secondaryButton,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderColor: '#3D8FB3',
  },
  primaryButtonText: { ...base.primaryButtonText, color: '#202C59' },
  secondaryButtonText: { ...base.secondaryButtonText, color: '#202C59' },
  section: { ...base.section, backgroundColor: '#F4FAFF' },
  sectionTitle: { ...base.sectionTitle, color: '#202C59' },
  sectionText: { ...base.sectionText, color: '#202C59' },
  supportCard: {
    ...base.supportCard,
    backgroundColor: '#FFFFFF',
    borderColor: '#3D8FB3',
  },
  supportCardText: { ...base.supportCardText, color: '#202C59' },
  divider: { ...base.divider, backgroundColor: 'rgba(61, 143, 179, 0.35)' },
  stepCard: {
    ...base.stepCard,
    backgroundColor: '#FFFFFF',
    borderColor: '#3D8FB3',
  },
  stepNumber: { ...base.stepNumber, color: '#3D8FB3' },
  stepTitle: { ...base.stepTitle, color: '#202C59' },
  stepText: { ...base.stepText, color: '#202C59' },
});