import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { useState } from 'react';
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
import { enterSession } from './backend/user';

export default function LoginPage() {
  const mode = 0;
  const isDark = mode === 0;
  const styles = isDark ? dark : light;

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  function updateField(key, value) {
    setForm(function (prev) {
      return {
        email: key === 'email' ? value : prev.email,
        password: key === 'password' ? value : prev.password,
      };
    });
  }

  async function handleLogin() {
    if (!form.email.trim() || !form.password.trim()) {
      Alert.alert('Missing details', 'Please fill your email and password.');
      return;
    }

    try {
      setLoading(true);

      const sessionResult = await enterSession({
        email: form.email.trim(),
        password: form.password,
      });

      if (sessionResult === false) {
        throw new Error('Login failed');
      }

      router.replace({
        pathname: '/home',
        params: {
          id: form.email.trim().toLowerCase(),
          email: form.email.trim(),
          name: form.email.trim().split('@')[0],
          age: '',
          description: '',
          role: '',
          pfp: '0',
        },
      });
    } catch (error) {
      console.log('login error', error);
      Alert.alert('Login failed', 'Wrong email or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={{
          uri: isDark
            ? 'https://static.vecteezy.com/system/resources/thumbnails/007/278/150/small_2x/dark-background-abstract-with-light-effect-vector.jpg'
            : 'https://images.ctfassets.net/nnkxuzam4k38/5uWJWkeNbfKj1xCb0QYw4W/5f98c1cf50300f106e1027609733e4cb/white-triangle.jpg',
        }}
        style={styles.background}
        resizeMode="cover"
      >
        <BlurView
          intensity={40}
          tint={isDark ? 'dark' : 'light'}
          style={styles.fill}
        />
        <View style={styles.overlay} />
        <Header mode={mode} />

        <ScrollView contentContainerStyle={styles.page}>
          <View style={styles.card}>
            <Text style={styles.title}>Log in</Text>
            <Text style={styles.subtitle}>
              Continue to your account and pick up where you left off.
            </Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
              value={form.email}
              onChangeText={function (value) {
                updateField('email', value);
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="name@example.com"
              placeholderTextColor={isDark ? '#8FA3B7' : '#6A7C8F'}
              style={styles.input}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              value={form.password}
              onChangeText={function (value) {
                updateField('password', value);
              }}
              secureTextEntry
              placeholder="Password"
              placeholderTextColor={isDark ? '#8FA3B7' : '#6A7C8F'}
              style={styles.input}
            />

            <Pressable
              onPress={handleLogin}
              disabled={loading}
              style={function ({ pressed }) {
                return [
                  styles.primaryButton,
                  pressed ? styles.primaryButtonPressed : null,
                ];
              }}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? 'Logging in...' : 'Log in'}
              </Text>
            </Pressable>

            <Pressable
              onPress={function () {
                router.push('/signup');
              }}
            >
              <Text style={styles.linkText}>
                Don&apos;t have an account? Sign up
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
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
    backgroundColor: 'rgba(35, 31, 32, 0.45)',
  },
  page: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 120,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 560,
    borderRadius: 22,
    borderWidth: 1,
    padding: 24,
    backgroundColor: 'rgba(32, 44, 89, 0.9)',
    borderColor: '#3D8FB3',
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    marginBottom: 8,
    color: '#F4FAFF',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    color: '#DEFFFE',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 6,
    color: '#F4FAFF',
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 8,
    color: '#F4FAFF',
    backgroundColor: '#231F20',
    borderColor: '#3D8FB3',
  },
  primaryButton: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: '#FC9E4F',
  },
  primaryButtonPressed: {
    opacity: 0.92,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#202C59',
  },
  linkText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 15,
    color: '#DEFFFE',
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
    backgroundColor: 'rgba(244, 250, 255, 0.28)',
  },
  page: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 120,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 560,
    borderRadius: 22,
    borderWidth: 1,
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderColor: '#3D8FB3',
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    marginBottom: 8,
    color: '#202C59',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    color: '#202C59',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 6,
    color: '#202C59',
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 8,
    color: '#202C59',
    backgroundColor: '#FFFFFF',
    borderColor: '#3D8FB3',
  },
  primaryButton: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: '#FC9E4F',
  },
  primaryButtonPressed: {
    opacity: 0.92,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#202C59',
  },
  linkText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 15,
    color: '#202C59',
  },
});