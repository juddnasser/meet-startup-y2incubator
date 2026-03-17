import { BlurView } from 'expo-blur';
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
import { editUserInDB } from './backend/user';

export default function ProfilePage() {
  const mode = 0;
  const styles = mode === 0 ? dark : light;

  const [form, setForm] = useState({
    id: 'demo-user-row-id',
    name: 'Demo user',
    age: '22',
    role: 'Student',
    jobdesc: 'Trying to move forward in education and work.',
    pfp: 0,
  });

  const [busy, setBusy] = useState(false);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    try {
      setBusy(true);

      const ok = await editUserInDB({
        ...form,
        age: form.age ? Number(form.age) : null,
      });

      if (ok === false) {
        throw new Error('Update failed');
      }

      Alert.alert('Saved', 'Your profile was updated.');
    } catch (err) {
      console.error(err);
      Alert.alert('Update failed', 'Could not save the changes.');
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
            <Text style={styles.title}>My profile</Text>
            <Text style={styles.subtitle}>
              Keep the details simple. You can change them anytime.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor={mode === 0 ? '#94A3B8' : '#64748B'}
              value={form.name}
              onChangeText={(value) => updateField('name', value)}
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
              placeholder="Role"
              placeholderTextColor={mode === 0 ? '#94A3B8' : '#64748B'}
              value={form.role}
              onChangeText={(value) => updateField('role', value)}
            />

            <TextInput
              style={[styles.input, styles.bigInput]}
              placeholder="Description"
              placeholderTextColor={mode === 0 ? '#94A3B8' : '#64748B'}
              multiline
              value={form.jobdesc}
              onChangeText={(value) => updateField('jobdesc', value)}
            />

            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleSave}
              disabled={busy}
            >
              <Text style={styles.buttonText}>
                {busy ? 'Saving...' : 'Save changes'}
              </Text>
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
    minHeight: 120,
    textAlignVertical: 'top',
  },
  button: {
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonPressed: {
    opacity: 0.92,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
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
});