import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Header from './header';
import { enterSession } from './backend/user';
export default function LoginPage() {
  const mode = 0;
  const styles = mode === 0 ? dark : light;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing details', 'Please enter email and password.');
      return;
    }

    try {
      setBusy(true);
      await enterSession({
        email: email.trim(),
        password,
      });

      router.replace('/feed');
    } catch (err) {
      console.error(err);
      Alert.alert('Login failed', 'Could not sign in.');
    } finally {
      setBusy(false);
    }
  }

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

        <View style={styles.page}>
          <View style={styles.card}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>
              Sign in and continue from where you left off.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={mode === 0 ? '#94A3B8' : '#64748B'}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={mode === 0 ? '#94A3B8' : '#64748B'}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleLogin}
              disabled={busy}
            >
              <Text style={styles.buttonText}>
                {busy ? 'Signing in...' : 'Login'}
              </Text>
            </Pressable>

            <Pressable onPress={() => router.push('/signup')}>
              <Text style={styles.link}>Need an account? Sign up</Text>
            </Pressable>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const base = {
  background: { flex: 1, width: '100%', height: '100%' },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 80,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    borderRadius: 20,
    borderWidth: 1,
    padding: 26,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 22,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 14,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
  },
  link: {
    textAlign: 'center',
    marginTop: 18,
    fontSize: 15,
  },
};

const dark = StyleSheet.create({
  ...base,
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(35, 31, 32, 0.45)',
  },
  card: {
    ...base.card,
    backgroundColor: 'rgba(32, 44, 89, 0.9)',
    borderColor: '#3D8FB3',
  },
  title: { ...base.title, color: '#F4FAFF' },
  subtitle: { ...base.subtitle, color: '#DEFFFE' },
  input: {
    ...base.input,
    color: '#F4FAFF',
    backgroundColor: '#231F20',
    borderColor: '#3D8FB3',
  },
  button: {
    ...base.button,
    backgroundColor: '#FC9E4F',
  },
  buttonText: { ...base.buttonText, color: '#202C59' },
  link: { ...base.link, color: '#DEFFFE' },
});

const light = StyleSheet.create({
  ...base,
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(244, 250, 255, 0.28)',
  },
  card: {
    ...base.card,
    backgroundColor: 'rgba(244, 250, 255, 0.94)',
    borderColor: '#3D8FB3',
  },
  title: { ...base.title, color: '#202C59' },
  subtitle: { ...base.subtitle, color: '#202C59' },
  input: {
    ...base.input,
    color: '#202C59',
    backgroundColor: '#FFFFFF',
    borderColor: '#3D8FB3',
  },
  button: {
    ...base.button,
    backgroundColor: '#FC9E4F',
  },
  buttonText: { ...base.buttonText, color: '#202C59' },
  link: { ...base.link, color: '#202C59' },
});