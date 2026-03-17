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

const TEAM_MEMBERS = [
  { name: 'Shalva', description: 'Project lead' },
  { name: 'Maya', description: 'User experience' },
  { name: 'Noor', description: 'Interface design' },
  { name: 'Joud', description: 'Backend development' },
  { name: 'Nadav', description: 'Frontend development' },
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
            <Text style={styles.heroTitle}>Hidush</Text>
            <Text style={styles.heroSubtitle}>
              Support, guidance, and real tools for people who want to build a
              wider future.
            </Text>

            <View style={styles.heroActions}>
              <Pressable
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && styles.primaryButtonPressed,
                ]}
                onPress={() => router.push('/signup')}
              >
                <Text style={styles.primaryButtonText}>Get started</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.secondaryButton,
                  pressed && styles.secondaryButtonPressed,
                ]}
                onPress={() => router.push('/feed')}
              >
                <Text style={styles.secondaryButtonText}>Community feed</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.secondaryButton,
                  pressed && styles.secondaryButtonPressed,
                ]}
                onPress={() => router.push('/chatbot')}
              >
                <Text style={styles.secondaryButtonText}>Chatbot</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.section}>
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>About us</Text>
          <Text style={styles.sectionText}>
            We are here to open doors. Hidush gives Haredim practical support,
            access to guidance, and a place to take first steps toward
            education, work, and broader participation in society. We want to
            make the path feel less lonely and much more possible.
          </Text>
        </View>

        <View style={styles.sectionDivider} />

        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>What you can do here</Text>

          <View style={styles.cardsRow}>
            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>Build a profile</Text>
              <Text style={styles.infoCardText}>
                Share your goals, background, and what kind of support you are
                looking for.
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>Post in the feed</Text>
              <Text style={styles.infoCardText}>
                Ask questions, share experiences, and hear from people who have
                already gone through similar steps.
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>Talk directly</Text>
              <Text style={styles.infoCardText}>
                Use messages and the chatbot to get practical help and continue
                conversations privately.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionDivider} />

        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Our team</Text>

          <View style={styles.teamGrid}>
            {TEAM_MEMBERS.map((member) => (
              <View key={member.name} style={styles.teamCard}>
                <View style={styles.teamPhoto}>
                  <Text style={styles.teamPhotoText}>{member.name[0]}</Text>
                </View>
                <Text style={styles.teamName}>{member.name}</Text>
                <Text style={styles.teamRole}>{member.description}</Text>
              </View>
            ))}
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
    maxWidth: 760,
    alignSelf: 'center',
  },
  heroTitle: {
    fontSize: 88,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  heroSubtitle: {
    fontSize: 22,
    lineHeight: 34,
    maxWidth: 680,
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
  primaryButtonPressed: {
    opacity: 0.92,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '700',
  },
  secondaryButton: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 22,
    paddingVertical: 16,
  },
  secondaryButtonPressed: {
    opacity: 0.92,
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
  sectionBlock: {
    width: '100%',
    maxWidth: 1080,
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 42,
    fontWeight: '800',
    marginBottom: 18,
  },
  sectionText: {
    fontSize: 18,
    lineHeight: 31,
    maxWidth: 920,
  },
  sectionDivider: {
    width: '100%',
    maxWidth: 1080,
    alignSelf: 'center',
    height: 1,
    marginVertical: 34,
  },
  cardsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  infoCard: {
    flexGrow: 1,
    flexBasis: 280,
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    minHeight: 180,
  },
  infoCardTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
  },
  infoCardText: {
    fontSize: 16,
    lineHeight: 26,
  },
  teamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
  },
  teamCard: {
    width: 190,
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
  },
  teamPhoto: {
    width: 84,
    height: 84,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  teamPhotoText: {
    fontSize: 30,
    fontWeight: '800',
  },
  teamName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  teamRole: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
};

const dark = StyleSheet.create({
  ...base,
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(35, 31, 32, 0.45)',
  },
  heroTitle: {
    ...base.heroTitle,
    color: '#F4FAFF',
  },
  heroSubtitle: {
    ...base.heroSubtitle,
    color: '#DEFFFE',
  },
  primaryButton: {
    ...base.primaryButton,
    backgroundColor: '#FC9E4F',
  },
  primaryButtonText: {
    ...base.primaryButtonText,
    color: '#202C59',
  },
  secondaryButton: {
    ...base.secondaryButton,
    backgroundColor: 'rgba(32, 44, 89, 0.58)',
    borderColor: '#3D8FB3',
  },
  secondaryButtonText: {
    ...base.secondaryButtonText,
    color: '#F4FAFF',
  },
  section: {
    ...base.section,
    backgroundColor: '#231F20',
  },
  sectionTitle: {
    ...base.sectionTitle,
    color: '#F4FAFF',
  },
  sectionText: {
    ...base.sectionText,
    color: '#DEFFFE',
  },
  sectionDivider: {
    ...base.sectionDivider,
    backgroundColor: 'rgba(61, 143, 179, 0.45)',
  },
  infoCard: {
    ...base.infoCard,
    backgroundColor: 'rgba(32, 44, 89, 0.88)',
    borderColor: '#3D8FB3',
  },
  infoCardTitle: {
    ...base.infoCardTitle,
    color: '#F4FAFF',
  },
  infoCardText: {
    ...base.infoCardText,
    color: '#DEFFFE',
  },
  teamCard: {
    ...base.teamCard,
    backgroundColor: 'rgba(32, 44, 89, 0.88)',
    borderColor: '#3D8FB3',
  },
  teamPhoto: {
    ...base.teamPhoto,
    backgroundColor: '#231F20',
    borderWidth: 1,
    borderColor: '#3D8FB3',
  },
  teamPhotoText: {
    ...base.teamPhotoText,
    color: '#FC9E4F',
  },
  teamName: {
    ...base.teamName,
    color: '#F4FAFF',
  },
  teamRole: {
    ...base.teamRole,
    color: '#DEFFFE',
  },
});

const light = StyleSheet.create({
  ...base,
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(244, 250, 255, 0.28)',
  },
  heroTitle: {
    ...base.heroTitle,
    color: '#202C59',
  },
  heroSubtitle: {
    ...base.heroSubtitle,
    color: '#202C59',
  },
  primaryButton: {
    ...base.primaryButton,
    backgroundColor: '#FC9E4F',
  },
  primaryButtonText: {
    ...base.primaryButtonText,
    color: '#202C59',
  },
  secondaryButton: {
    ...base.secondaryButton,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderColor: '#3D8FB3',
  },
  secondaryButtonText: {
    ...base.secondaryButtonText,
    color: '#202C59',
  },
  section: {
    ...base.section,
    backgroundColor: '#F4FAFF',
  },
  sectionTitle: {
    ...base.sectionTitle,
    color: '#202C59',
  },
  sectionText: {
    ...base.sectionText,
    color: '#202C59',
  },
  sectionDivider: {
    ...base.sectionDivider,
    backgroundColor: 'rgba(61, 143, 179, 0.35)',
  },
  infoCard: {
    ...base.infoCard,
    backgroundColor: '#FFFFFF',
    borderColor: '#3D8FB3',
  },
  infoCardTitle: {
    ...base.infoCardTitle,
    color: '#202C59',
  },
  infoCardText: {
    ...base.infoCardText,
    color: '#202C59',
  },
  teamCard: {
    ...base.teamCard,
    backgroundColor: '#FFFFFF',
    borderColor: '#3D8FB3',
  },
  teamPhoto: {
    ...base.teamPhoto,
    backgroundColor: '#F4FAFF',
    borderWidth: 1,
    borderColor: '#3D8FB3',
  },
  teamPhotoText: {
    ...base.teamPhotoText,
    color: '#202C59',
  },
  teamName: {
    ...base.teamName,
    color: '#202C59',
  },
  teamRole: {
    ...base.teamRole,
    color: '#3D8FB3',
  },
});