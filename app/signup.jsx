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
import { SetupUserInDB } from './backend/user';

export default function SignupPage() {
  const mode = 0;
  const styles = mode === 0 ? dark : light;

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    role: '',
    description: '',
  });

  const [busy, setBusy] = useState(false);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSignup() {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      Alert.alert('Missing details', 'Name, email and password are required.');
      return;
    }

    try {
      setBusy(true);

      const ok = await SetupUserInDB({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        age: form.age ? Number(form.age) : null,
        role: form.role.trim(),
        description: form.description.trim(),
      });

      if (ok === false) {
        throw new Error('Signup failed');
      }

      router.replace('/feed');
    } catch (err) {
      console.error(err);
      Alert.alert('Signup failed', 'Could not create the account.');
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

        <ScrollView contentContainerStyle={styles.page}>
          <View style={styles.card}>
            <Text style={styles.title}>Create your profile</Text>
            <Text style={styles.subtitle}>
              Start with a few basic details. You can update them later.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Full name"
              placeholderTextColor={mode === 0 ? '#94A3B8' : '#64748B'}
              value={form.name}
              onChangeText={(value) => updateField('name', value)}
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={mode === 0 ? '#94A3B8' : '#64748B'}
              autoCapitalize="none"
              keyboardType="email-address"
              value={form.email}
              onChangeText={(value) => updateField('email', value)}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={mode === 0 ? '#94A3B8' : '#64748B'}
              secureTextEntry
              value={form.password}
              onChangeText={(value) => updateField('password', value)}
            />

            <TextInput
              style={styles.input}
              placeholder="Age"
              placeholderTextColor={mode === 0 ? '#94A3B8' : '#64748B'}
              keyboardType="numeric"
              value={form.age}
              onChangeText={(value) => updateField('age', value)}
            />

            <TextInput
              style={styles.input}
              placeholder="Current role or goal"
              placeholderTextColor={mode === 0 ? '#94A3B8' : '#64748B'}
              value={form.role}
              onChangeText={(value) => updateField('role', value)}
            />

            <TextInput
              style={[styles.input, styles.bigInput]}
              placeholder="A few words about yourself"
              placeholderTextColor={mode === 0 ? '#94A3B8' : '#64748B'}
              multiline
              value={form.description}
              onChangeText={(value) => updateField('description', value)}
            />

            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleSignup}
              disabled={busy}
            >
              <Text style={styles.buttonText}>
                {busy ? 'Creating account...' : 'Sign up'}
              </Text>
            </Pressable>

            <Pressable onPress={() => router.push('/login')}>
              <Text style={styles.link}>Already registered? Login</Text>
            </Pressable>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const base = {
  background: { flex: 1, width: '100%', height: '100%' },
  page: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 120,
    paddingBottom: 36,
  },
  card: {
    width: '100%',
    maxWidth: 560,
    borderRadius: 20,
    borderWidth: 1,
    padding: 26,
  },
  title: {
    fontSize: 33,
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
  bigInput: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  button: {
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonPressed: {
    opacity: 0.9,
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
  bigInput: base.bigInput,
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
  bigInput: base.bigInput,
  button: {
    ...base.button,
    backgroundColor: '#FC9E4F',
  },
  buttonText: { ...base.buttonText, color: '#202C59' },
  link: { ...base.link, color: '#202C59' },
});