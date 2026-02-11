import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from './header';

export default homePge

function homePge() {
  let mode = 0; //changes between dark and light; 0 or 1
  let stylesMain = [stylesMainDark, stylesMainLight];
  let imgSRC = ["https://static.vecteezy.com/system/resources/thumbnails/007/278/150/small_2x/dark-background-abstract-with-light-effect-vector.jpg", "https://images.ctfassets.net/nnkxuzam4k38/5uWJWkeNbfKj1xCb0QYw4W/5f98c1cf50300f106e1027609733e4cb/white-triangle.jpg"]
  const TEAM_MEMBERS = [{
    name: "Person1",
    description: "Lorem Ipsum"
  }, {
    name: "Person1",
    description: "Lorem Ipsum"
  }, {
    name: "Person1",
    description: "Lorem Ipsum"
  }, {
    name: "Person1",
    description: "Lorem Ipsum"
  }, {
    name: "Person1",
    description: "Lorem Ipsum"
  }, {
    name: "Person1",
    description: "Lorem Ipsum"
  },]
  const TEAM_ROWS = [
    TEAM_MEMBERS.slice(0, 3), // First row
    TEAM_MEMBERS.slice(3)     // Second row
  ];

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
      <ImageBackground
        source={imgSRC[mode]}
        style={stylesMain[mode].background}
        resizeMode="cover"
      >
        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={stylesMain[mode].overlay} />
        <Header mode={mode} />

        {/* Main text and buttons */}
        <View style={stylesMain[mode].mainTextBlock}>
          <Text style={stylesMain[mode].mainText}>PLACEHOLDER</Text>
          <View style={stylesMain[mode].secondaryTextBlock}>
            <Pressable
              style={({ pressed }) => [
                stylesMain[mode].menuItem,
                pressed && stylesMain[mode].menuItemPressed,
              ]}
              onPress={() => router.push('/chatbot')}
            >
              <Text style={stylesMain[mode].menuText}>Chatbot</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                stylesMain[mode].menuItem,
                pressed && stylesMain[mode].menuItemPressed,
              ]}
              onPress={() => router.push('/')}
            >
              <Text style={stylesMain[mode].menuText}>another PG</Text>
            </Pressable>
          </View>
        </View>
      </ImageBackground>

      <View style={stylesMain[mode].textSection}>
        {/* About */}
        <Text style={stylesMain[mode].sectionTitle}>About Us</Text>
        <Text style={stylesMain[mode].sectionText}>
          {'\t'}Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </Text>
        <Text style={[stylesMain[mode].sectionTitle, { alignSelf: "center" }]}>---</Text>
        {/* Team Section */}
        <Text style={stylesMain[mode].sectionTitle}>Our Team</Text>
        {TEAM_ROWS.map((row, rowIndex) => (
          <View key={rowIndex} style={stylesMain[mode].teamRow}>
            {row.map((member, index) => (
              <Pressable onPress={() => { router.push({ pathname: '/team', params: { state: parseInt(index) } }) }} key={index} style={stylesMain[mode].teamMember}>
                <View style={stylesMain[mode].teamPhoto} />
                <Text style={stylesMain[mode].personName}>{member.name}</Text>
                <Text style={stylesMain[mode].personText}>{member.description}</Text>
              </Pressable>
            ))}
          </View>
        ))}
        <Text style={[stylesMain[mode].sectionTitle, { alignSelf: "center" }]}>---</Text>

      </View>
    </ScrollView>
  )
}

const stylesMainDark = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.45)' },

  mainTextBlock: { justifyContent: 'center', alignItems: 'flex-start', marginLeft: 200, paddingVertical: 350 },
  mainText: { fontSize: 120, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'left', marginBottom: 40, letterSpacing: 1 },
  secondaryTextBlock: { flexDirection: 'row' },

  menuItem: { borderWidth: 1, borderColor: '#3B82F6', borderRadius: 12, paddingHorizontal: 28, paddingVertical: 16, marginRight: 24, backgroundColor: 'rgba(0,0,0,0.4)' },
  menuItemPressed: { backgroundColor: 'rgba(59,130,246,0.25)' },
  menuText: { color: '#FFFFFF', fontSize: 24, fontWeight: '500' },

  textSection: { paddingTop: 200, paddingHorizontal: 200, paddingBottom: 100, backgroundColor: '#050B14' },
  sectionTitle: { fontSize: 100, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'left', marginBottom: 40 },
  sectionText: { fontSize: 24, lineHeight: 36, color: '#CBD5E1', textAlign: 'left', marginBottom: 60 },

  teamRow: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 60 },
  teamMember: { width: 250, marginBottom: 40, marginHorizontal: 40, marginTop: 10, alignItems: 'center' },
  teamPhoto: { width: 250, height: 250, borderRadius: 50, backgroundColor: '#0F172A', marginBottom: 16, borderWidth: 1, borderColor: '#1E3A8A' },
  personName: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8, textAlign: 'center' },
  personText: { fontSize: 20, color: '#94A3B8', lineHeight: 28, textAlign: 'center' },

  faqItem: { marginBottom: 24, borderWidth: 1, borderColor: '#1E3A8A', borderRadius: 12, overflow: 'hidden', backgroundColor: '#020617' },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  faqQuestion: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
  faqDivider: { height: 1, backgroundColor: '#1E3A8A', marginHorizontal: 16 },
  faqAnswer: { fontSize: 20, color: '#CBD5E1', padding: 16 },
});

const stylesMainLight = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255, 255, 255, 0.25)' },

  mainTextBlock: { justifyContent: 'center', alignItems: 'flex-start', marginLeft: 200, paddingVertical: 350 },
  mainText: { fontSize: 120, fontWeight: 'bold', color: '#020617', textAlign: 'left', marginBottom: 40, letterSpacing: 1 },
  secondaryTextBlock: { flexDirection: 'row' },

  menuItem: { borderWidth: 1, borderColor: '#2563EB', borderRadius: 12, paddingHorizontal: 28, paddingVertical: 16, marginRight: 24, backgroundColor: 'rgba(255,255,255,0.7)' },
  menuItemPressed: { backgroundColor: 'rgba(37,99,235,0.15)' },
  menuText: { color: '#020617', fontSize: 24, fontWeight: '500' },

  textSection: { paddingTop: 200, paddingHorizontal: 200, paddingBottom: 100, backgroundColor: '#F8FAFC' },
  sectionTitle: { fontSize: 100, fontWeight: 'bold', color: '#020617', textAlign: 'left', marginBottom: 40 },
  sectionText: { fontSize: 24, lineHeight: 36, color: '#334155', textAlign: 'left', marginBottom: 60 },

  teamRow: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 60 },
  teamMember: { width: 250, marginBottom: 40, marginHorizontal: 40, marginTop: 10, alignItems: 'center' },
  teamPhoto: { width: 250, height: 250, borderRadius: 50, backgroundColor: '#E5E7EB', marginBottom: 16, borderWidth: 1, borderColor: '#CBD5E1' },
  personName: { fontSize: 32, fontWeight: 'bold', color: '#020617', marginBottom: 8, textAlign: 'center' },
  personText: { fontSize: 20, color: '#475569', lineHeight: 28, textAlign: 'center' },

  faqItem: { marginBottom: 24, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 12, overflow: 'hidden', backgroundColor: '#FFFFFF' },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  faqQuestion: { fontSize: 24, fontWeight: 'bold', color: '#020617' },
  faqDivider: { height: 1, backgroundColor: '#E2E8F0', marginHorizontal: 16 },
  faqAnswer: { fontSize: 20, color: '#334155', padding: 16 },
});
