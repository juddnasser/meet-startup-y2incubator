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
import { editUserInDB } from './backend/user';

export default function ProfilePage() {
  const mode = 0;
  const styles = mode === 0 ? dark : light;

 
  const [saving, setSaving] = useState(false);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    try {
      setSaving(true);

      const result = await editUserInDB({
        ...form,
        age: form.age ? Number(form.age) : null,
      });

      if (result === false) {
        throw new Error('Save failed');
      }

      Alert.alert('Saved', 'Your profile was updated.');
    } catch (error) {
      console.error(error);
      Alert.alert('Could not save', 'Please try again.');
    } finally {
      setSaving(false);
    }
  }

  function handleSignOut() {
    router.replace('/login');
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
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.subtitle}>
              Update your details and keep your profile current.
            </Text>

            <Text style={styles.label}>Full name</Text>
            <TextInput
              onChangeText={(value) => updateField('name', value)}
              placeholder="Full name"
              placeholderTextColor={mode === 0 ? '#8FA3B7' : '#6A7C8F'}
              style={styles.input}
            />

            <Text style={styles.label}>Age</Text>
            <TextInput
              onChangeText={(value) => updateField('age', value)}
              keyboardType="numeric"
              placeholder="Age"
              placeholderTextColor={mode === 0 ? '#8FA3B7' : '#6A7C8F'}
              style={styles.input}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              onChangeText={(value) => updateField('jobdesc', value)}
              multiline
              placeholder="Tell people a bit about yourself"
              placeholderTextColor={mode === 0 ? '#8FA3B7' : '#6A7C8F'}
              style={[styles.input, styles.descriptionInput]}
            />

            <View style={styles.buttonRow}>
              <Pressable
                onPress={handleSave}
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && styles.primaryButtonPressed,
                ]}
                disabled={saving}
              >
                <Text style={styles.primaryButtonText}>
                  {saving ? 'Saving...' : 'Save changes'}
                </Text>
              </Pressable>

              <Pressable
                onPress={handleSignOut}
                style={({ pressed }) => [
                  styles.secondaryButton,
                  pressed && styles.secondaryButtonPressed,
                ]}
              >
                <Text style={styles.secondaryButtonText}>Sign out</Text>
              </Pressable>
            </View>
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
    maxWidth: 620,
    borderRadius: 24,
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
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 18,
  },
  primaryButton: {
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginRight: 10,
    marginBottom: 10,
  },
  primaryButtonPressed: {
    opacity: 0.92,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 10,
  },
  secondaryButtonPressed: {
    opacity: 0.92,
  },
  secondaryButtonText: {
    fontSize: 16,
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
  secondaryButton: {
    ...base.secondaryButton,
    backgroundColor: '#231F20',
    borderColor: '#3D8FB3',
  },
  secondaryButtonText: {
    ...base.secondaryButtonText,
    color: '#F4FAFF',
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
  secondaryButton: {
    ...base.secondaryButton,
    backgroundColor: '#FFFFFF',
    borderColor: '#3D8FB3',
  },
  secondaryButtonText: {
    ...base.secondaryButtonText,
    color: '#202C59',
  },
});