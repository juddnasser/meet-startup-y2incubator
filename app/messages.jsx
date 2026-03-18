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
    id: 'user1',
    name: 'Moshe',
    topic: 'Mentorship',
    preview: 'I can help you understand how to start learning programming.',
    unread: true,
  },
  {
    id: 'user2',
    name: 'Yael',
    topic: 'Emotional Support',
    preview: 'You can talk to me anytime if you feel stuck.',
    unread: false,
  },
  {
    id: 'user3',
    name: 'David',
    topic: 'Career Help',
    preview: 'Let’s figure out what direction works best for you.',
    unread: true,
  },
];

export default function MessagesPage() {
  const mode = 0;
  const isDark = mode === 0;

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
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: isDark
              ? 'rgba(35,31,32,0.5)'
              : 'rgba(255,255,255,0.4)',
          }}
        />

        <Header mode={mode} />

        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.top}>
            <Text
              style={{
                fontSize: 32,
                fontWeight: '700',
                marginBottom: 8,
                color: isDark ? '#F4FAFF' : '#202C59',
              }}
            >
              Messages
            </Text>

            <Text
              style={{
                fontSize: 15,
                color: isDark ? '#DEFFFE' : '#202C59',
              }}
            >
              Continue your conversations with people who support you.
            </Text>
          </View>

          {conversations.map((item) => (
            <Pressable
              key={item.id}
              onPress={() =>
                router.push({
                  pathname: '/backend/chats/[peerId]',
                  params: { peerId: item.id, name: item.name },
                })
              }
              style={({ pressed }) => [
                styles.card,
                {
                  backgroundColor: isDark
                    ? 'rgba(32,44,89,0.9)'
                    : '#ffffff',
                  borderColor: '#3D8FB3',
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
            >
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 18,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                  backgroundColor: isDark ? '#231F20' : '#F4FAFF',
                  borderWidth: 1,
                  borderColor: '#3D8FB3',
                }}
              >
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: '700',
                    color: isDark ? '#FC9E4F' : '#202C59',
                  }}
                >
                  {item.name[0]}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <View style={styles.rowTop}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '700',
                      color: isDark ? '#F4FAFF' : '#202C59',
                    }}
                  >
                    {item.name}
                  </Text>

                  {item.unread && (
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 10,
                        backgroundColor: '#FC9E4F',
                      }}
                    />
                  )}
                </View>

                <Text
                  style={{
                    fontSize: 13,
                    marginBottom: 6,
                    color: isDark ? '#DEFFFE' : '#3D8FB3',
                  }}
                >
                  {item.topic}
                </Text>

                <Text
                  style={{
                    fontSize: 14,
                    color: isDark ? '#F4FAFF' : '#202C59',
                  }}
                >
                  {item.preview}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  container: {
    paddingTop: 120,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },

  top: {
    marginBottom: 20,
  },

  card: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
    alignItems: 'center',
  },

  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});