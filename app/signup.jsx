// app/signup.jsx
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

const SUPPORT_OPTIONS = [
  'Financial Support',
  'Emotional Support',
  'Mentorship',
  'Professional Advice',
  'Other',
];

export default function SignupPage() {
  const mode = 0;
  const styles = mode === 0 ? dark : light;

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    description: '',
    communityType: 'Haredi',
    supportDirection: 'I need support',
    selectedSupports: [],
  });

  const [busy, setBusy] = useState(false);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleSupport(option) {
    setForm((prev) => {
      const exists = prev.selectedSupports.includes(option);
      return {
        ...prev,
        selectedSupports: exists
          ? prev.selectedSupports.filter((item) => item !== option)
          : [...prev.selectedSupports, option],
      };
    });
  }

  async function handleSignup() {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      Alert.alert('Missing details', 'Name, email and password are required.');
      return;
    }

    try {
      setBusy(true);

      const role = [
        form.communityType,
        form.supportDirection,
        ...form.selectedSupports,
      ].join(' | ');

      const ok = await SetupUserInDB({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        age: form.age ? Number(form.age) : null,
        role,
        description: form.description.trim(),
      });

      if (ok === false) {
        throw new Error('Signup failed');
      }

      router.replace('/home');
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
              Join Hidush and tell us what kind of support matters to you.
            </Text>

            <Text style={styles.label}>You are</Text>
            <View style={styles.chipRow}>
              {['Haredi', 'Not Haredi'].map((option) => {
                const active = form.communityType === option;
                return (
                  <Pressable
                    key={option}
                    style={[styles.chip, active ? styles.chipActive : null]}
                    onPress={() => updateField('communityType', option)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        active ? styles.chipTextActive : null,
                      ]}
                    >
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

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
              style={[styles.input, styles.bigInput]}
              placeholder="A few words about yourself"
              placeholderTextColor={mode === 0 ? '#94A3B8' : '#64748B'}
              multiline
              value={form.description}
              onChangeText={(value) => updateField('description', value)}
            />

            <Text style={styles.label}>This account is for</Text>
            <View style={styles.chipRow}>
              {['I need support', 'I can offer support'].map((option) => {
                const active = form.supportDirection === option;
                return (
                  <Pressable
                    key={option}
                    style={[styles.chip, active ? styles.chipActive : null]}
                    onPress={() => updateField('supportDirection', option)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        active ? styles.chipTextActive : null,
                      ]}
                    >
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.label}>
              {form.supportDirection === 'I need support'
                ? 'What kind of support do you need?'
                : 'What support can you offer?'}
            </Text>

            <View style={styles.supportWrap}>
              {SUPPORT_OPTIONS.map((option) => {
                const active = form.selectedSupports.includes(option);
                return (
                  <Pressable
                    key={option}
                    style={[
                      styles.supportChip,
                      active ? styles.supportChipActive : null,
                    ]}
                    onPress={() => toggleSupport(option)}
                  >
                    <Text
                      style={[
                        styles.supportChipText,
                        active ? styles.supportChipTextActive : null,
                      ]}
                    >
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed ? styles.buttonPressed : null,
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

const dark = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(35, 31, 32, 0.45)',
  },
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
    maxWidth: 640,
    borderRadius: 20,
    borderWidth: 1,
    padding: 26,
    backgroundColor: 'rgba(32, 44, 89, 0.9)',
    borderColor: '#3D8FB3',
  },
  title: {
    fontSize: 33,
    fontWeight: '700',
    marginBottom: 8,
    color: '#F4FAFF',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 22,
    color: '#DEFFFE',
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    color: '#F4FAFF',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 10,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 11,
    backgroundColor: '#231F20',
    borderColor: '#3D8FB3',
  },
  chipActive: {
    backgroundColor: '#FC9E4F',
    borderColor: '#FC9E4F',
  },
  chipText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F4FAFF',
  },
  chipTextActive: {
    color: '#202C59',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 14,
    color: '#F4FAFF',
    backgroundColor: '#231F20',
    borderColor: '#3D8FB3',
  },
  bigInput: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  supportWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 10,
  },
  supportChip: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: '#231F20',
    borderColor: '#3D8FB3',
  },
  supportChipActive: {
    backgroundColor: 'rgba(252, 158, 79, 0.18)',
    borderColor: '#FC9E4F',
  },
  supportChipText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F4FAFF',
  },
  supportChipTextActive: {
    color: '#FC9E4F',
  },
  button: {
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 6,
    backgroundColor: '#FC9E4F',
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#202C59',
  },
  link: {
    textAlign: 'center',
    marginTop: 18,
    fontSize: 15,
    color: '#DEFFFE',
  },
});

const light = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(244, 250, 255, 0.28)',
  },
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
    maxWidth: 640,
    borderRadius: 20,
    borderWidth: 1,
    padding: 26,
    backgroundColor: 'rgba(244, 250, 255, 0.94)',
    borderColor: '#3D8FB3',
  },
  title: {
    fontSize: 33,
    fontWeight: '700',
    marginBottom: 8,
    color: '#202C59',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 22,
    color: '#202C59',
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    color: '#202C59',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 10,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 11,
    backgroundColor: '#FFFFFF',
    borderColor: '#3D8FB3',
  },
  chipActive: {
    backgroundColor: '#FC9E4F',
    borderColor: '#FC9E4F',
  },
  chipText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#202C59',
  },
  chipTextActive: {
    color: '#202C59',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 14,
    color: '#202C59',
    backgroundColor: '#FFFFFF',
    borderColor: '#3D8FB3',
  },
  bigInput: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  supportWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 10,
  },
  supportChip: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: '#FFFFFF',
    borderColor: '#3D8FB3',
  },
  supportChipActive: {
    backgroundColor: 'rgba(252, 158, 79, 0.16)',
    borderColor: '#FC9E4F',
  },
  supportChipText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#202C59',
  },
  supportChipTextActive: {
    color: '#202C59',
  },
  button: {
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 6,
    backgroundColor: '#FC9E4F',
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#202C59',
  },
  link: {
    textAlign: 'center',
    marginTop: 18,
    fontSize: 15,
    color: '#202C59',
  },
});