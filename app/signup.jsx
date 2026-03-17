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
    email: '',
    password: '',
    fullName: '',
    age: '',
    description: '',
  });
  const [saving, setSaving] = useState(false);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSignup() {
    if (!form.email.trim() || !form.password.trim() || !form.fullName.trim()) {
      Alert.alert('Missing details', 'Please fill email, password, and full name.');
      return;
    }

    try {
      setSaving(true);

      const ok = await SetupUserInDB({
        email: form.email.trim(),
        password: form.password,
        name: form.fullName.trim(),
        age: form.age ? Number(form.age) : null,
        description: form.description.trim(),
        role: '',
        pfp: 0,
      });

      if (ok === false) {
        throw new Error('Signup failed');
      }

      router.replace('/feed');
    } catch (error) {
      console.error(error);
      Alert.alert('Could not sign up', 'Please try again.');
    } finally {
      setSaving(false);
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
            <Text style={styles.title}>Sign up</Text>
            <Text style={styles.subtitle}>
              Create your account and tell us a little about yourself.
            </Text>

            <Text style={styles.label}>Email / Username</Text>
            <TextInput
              value={form.email}
              onChangeText={(value) => updateField('email', value)}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="name@example.com"
              placeholderTextColor={mode === 0 ? '#8FA3B7' : '#6A7C8F'}
              style={styles.input}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              value={form.password}
              onChangeText={(value) => updateField('password', value)}
              secureTextEntry
              placeholder="Password"
              placeholderTextColor={mode === 0 ? '#8FA3B7' : '#6A7C8F'}
              style={styles.input}
            />

            <Text style={styles.label}>Full name</Text>
            <TextInput
              value={form.fullName}
              onChangeText={(value) => updateField('fullName', value)}
              placeholder="Full name"
              placeholderTextColor={mode === 0 ? '#8FA3B7' : '#6A7C8F'}
              style={styles.input}
            />

            <Text style={styles.label}>Age</Text>
            <TextInput
              value={form.age}
              onChangeText={(value) => updateField('age', value)}
              keyboardType="numeric"
              placeholder="Age"
              placeholderTextColor={mode === 0 ? '#8FA3B7' : '#6A7C8F'}
              style={styles.input}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              value={form.description}
              onChangeText={(value) => updateField('description', value)}
              multiline
              placeholder="Write a short description about yourself"
              placeholderTextColor={mode === 0 ? '#8FA3B7' : '#6A7C8F'}
              style={[styles.input, styles.descriptionInput]}
            />

            <Pressable
              onPress={handleSignup}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed,
              ]}
              disabled={saving}
            >
              <Text style={styles.primaryButtonText}>
                {saving ? 'Creating account...' : 'Sign up'}
              </Text>
            </Pressable>

            <Pressable onPress={() => router.push('/login')}>
              <Text style={styles.linkText}>Already have an account? Log in</Text>
            </Pressable>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const base = {
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
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
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 8,
  },
  descriptionInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  primaryButton: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 16,
  },
  primaryButtonPressed: {
    opacity: 0.92,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '700',
  },
  linkText: {
    textAlign: 'center',
    marginTop: 16,
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
  title: {
    ...base.title,
    color: '#F4FAFF',
  },
  subtitle: {
    ...base.subtitle,
    color: '#DEFFFE',
  },
  label: {
    ...base.label,
    color: '#F4FAFF',
  },
  input: {
    ...base.input,
    color: '#F4FAFF',
    backgroundColor: '#231F20',
    borderColor: '#3D8FB3',
  },
  descriptionInput: base.descriptionInput,
  primaryButton: {
    ...base.primaryButton,
    backgroundColor: '#FC9E4F',
  },
  primaryButtonText: {
    ...base.primaryButtonText,
    color: '#202C59',
  },
  linkText: {
    ...base.linkText,
    color: '#DEFFFE',
  },
});

const light = StyleSheet.create({
  ...base,
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(244, 250, 255, 0.28)',
  },
  card: {
    ...base.card,
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderColor: '#3D8FB3',
  },
  title: {
    ...base.title,
    color: '#202C59',
  },
  subtitle: {
    ...base.subtitle,
    color: '#202C59',
  },
  label: {
    ...base.label,
    color: '#202C59',
  },
  input: {
    ...base.input,
    color: '#202C59',
    backgroundColor: '#FFFFFF',
    borderColor: '#3D8FB3',
  },
  descriptionInput: base.descriptionInput,
  primaryButton: {
    ...base.primaryButton,
    backgroundColor: '#FC9E4F',
  },
  primaryButtonText: {
    ...base.primaryButtonText,
    color: '#202C59',
  },
  linkText: {
    ...base.linkText,
    color: '#202C59',
  },
});