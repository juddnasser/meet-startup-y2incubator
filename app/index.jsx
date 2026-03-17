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
    name: "Shalva",
    description: "PM"
  }, {
    name: "Maya",
    description: "UX"
  }, {
    name: "Noor",
    description: "UI"
  }, {
    name: "Joud",
    description: "Backend Developer"
  }, {
    name: "Nadav",
    description: "Frontend Developer"
  }]
  const TEAM_ROWS = [
    TEAM_MEMBERS.slice(0,3), // First row
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
          <Text style={stylesMain[mode].mainText}>Hidush</Text>
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
          {'\t'}'We are Hidush - Our app provides Haredim with the tools, support, and confidence to pursue new paths-whether in education, careers, or broader participation in society.
Through personalized guidance, accessible information, and a supportive community, we help turn ambition into reality and build bridges between worlds.'
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
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(35, 31, 32, 0.45)' },

  mainTextBlock: { justifyContent: 'center', alignItems: 'flex-start', marginLeft: 200, paddingVertical: 350 },
  mainText: { fontSize: 120, fontWeight: 'bold', color: '#F4FAFF', textAlign: 'left', marginBottom: 40, letterSpacing: 1 },
  secondaryTextBlock: { flexDirection: 'row' },

  menuItem: {
    borderWidth: 1,
    borderColor: '#3D8FB3',
    borderRadius: 12,
    paddingHorizontal: 28,
    paddingVertical: 16,
    marginRight: 24,
    backgroundColor: 'rgba(32, 44, 89, 0.55)',
  },
  menuItemPressed: { backgroundColor: 'rgba(252, 158, 79, 0.22)' },
  menuText: { color: '#F4FAFF', fontSize: 24, fontWeight: '500' },

  textSection: {
    paddingTop: 200,
    paddingHorizontal: 200,
    paddingBottom: 100,
    backgroundColor: '#231F20',
  },
  sectionTitle: { fontSize: 100, fontWeight: 'bold', color: '#F4FAFF', textAlign: 'left', marginBottom: 40 },
  sectionText: { fontSize: 24, lineHeight: 36, color: '#DEFFFE', textAlign: 'left', marginBottom: 60 },

  teamRow: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 60 },
  teamMember: { width: 250, marginBottom: 40, marginHorizontal: 40, marginTop: 10, alignItems: 'center' },
  teamPhoto: {
    width: 250,
    height: 250,
    borderRadius: 50,
    backgroundColor: '#202C59',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3D8FB3',
  },
  personName: { fontSize: 32, fontWeight: 'bold', color: '#F4FAFF', marginBottom: 8, textAlign: 'center' },
  personText: { fontSize: 20, color: '#DEFFFE', lineHeight: 28, textAlign: 'center' },

  faqItem: {
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#3D8FB3',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#202C59',
  },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  faqQuestion: { fontSize: 24, fontWeight: 'bold', color: '#F4FAFF' },
  faqDivider: { height: 1, backgroundColor: '#3D8FB3', marginHorizontal: 16 },
  faqAnswer: { fontSize: 20, color: '#DEFFFE', padding: 16 },
});

const stylesMainLight = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(244, 250, 255, 0.25)' },

  mainTextBlock: { justifyContent: 'center', alignItems: 'flex-start', marginLeft: 200, paddingVertical: 350 },
  mainText: { fontSize: 120, fontWeight: 'bold', color: '#202C59', textAlign: 'left', marginBottom: 40, letterSpacing: 1 },
  secondaryTextBlock: { flexDirection: 'row' },

  menuItem: {
    borderWidth: 1,
    borderColor: '#202C59',
    borderRadius: 12,
    paddingHorizontal: 28,
    paddingVertical: 16,
    marginRight: 24,
    backgroundColor: 'rgba(222, 255, 254, 0.75)',
  },
  menuItemPressed: { backgroundColor: 'rgba(252, 158, 79, 0.18)' },
  menuText: { color: '#202C59', fontSize: 24, fontWeight: '500' },

  textSection: {
    paddingTop: 200,
    paddingHorizontal: 200,
    paddingBottom: 100,
    backgroundColor: '#F4FAFF',
  },
  sectionTitle: { fontSize: 100, fontWeight: 'bold', color: '#202C59', textAlign: 'left', marginBottom: 40 },
  sectionText: { fontSize: 24, lineHeight: 36, color: '#3D8FB3', textAlign: 'left', marginBottom: 60 },

  teamRow: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 60 },
  teamMember: { width: 250, marginBottom: 40, marginHorizontal: 40, marginTop: 10, alignItems: 'center' },
  teamPhoto: {
    width: 250,
    height: 250,
    borderRadius: 50,
    backgroundColor: '#DEFFFE',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3D8FB3',
  },
  personName: { fontSize: 32, fontWeight: 'bold', color: '#202C59', marginBottom: 8, textAlign: 'center' },
  personText: { fontSize: 20, color: '#3D8FB3', lineHeight: 28, textAlign: 'center' },

  faqItem: {
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#3D8FB3',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  faqQuestion: { fontSize: 24, fontWeight: 'bold', color: '#202C59' },
  faqDivider: { height: 1, backgroundColor: '#DEFFFE', marginHorizontal: 16 },
  faqAnswer: { fontSize: 20, color: '#3D8FB3', padding: 16 },
});