import { BlurView } from 'expo-blur';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
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
  const params = useLocalSearchParams();
  const mode = 0;
  const isDark = mode === 0;
  const styles = isDark ? dark : light;

  const [form, setForm] = useState({
    id: '',
    email: '',
    name: '',
    age: '',
    description: '',
    role: '',
    pfp: '0',
  });

  const [saving, setSaving] = useState(false);

  useEffect(function () {
    setForm({
      id: typeof params.id === 'string' ? params.id : '',
      email: typeof params.email === 'string' ? params.email : '',
      name: typeof params.name === 'string' ? params.name : '',
      age: typeof params.age === 'string' ? params.age : '',
      description: typeof params.description === 'string' ? params.description : '',
      role: typeof params.role === 'string' ? params.role : '',
      pfp: typeof params.pfp === 'string' ? params.pfp : '0',
    });
  }, [params]);

  function updateField(key, value) {
    setForm(function (prev) {
      return {
        id: prev.id,
        email: prev.email,
        name: key === 'name' ? value : prev.name,
        age: key === 'age' ? value : prev.age,
        description: key === 'description' ? value : prev.description,
        role: key === 'role' ? value : prev.role,
        pfp: prev.pfp,
      };
    });
  }

  async function handleSave() {
    try {
      setSaving(true);

      const nextProfile = {
        id: form.id,
        email: form.email,
        name: form.name.trim(),
        age: form.age.trim(),
        description: form.description.trim(),
        role: form.role.trim(),
        pfp: form.pfp,
      };

      const result = await editUserInDB({
        id: nextProfile.id,
        email: nextProfile.email,
        name: nextProfile.name,
        age: nextProfile.age ? Number(nextProfile.age) : null,
        description: nextProfile.description,
        role: nextProfile.role,
        pfp: Number(nextProfile.pfp),
      });

      if (result === false) {
        throw new Error('Save failed');
      }

      router.replace({
        pathname: '/home',
        params: nextProfile,
      });

      Alert.alert('Saved', 'Your profile was updated.');
    } catch (error) {
      console.log(error);
      Alert.alert('Could not save', 'Please try again.');
    } finally {
      setSaving(false);
    }
  }

  function handleBackHome() {
    router.replace({
      pathname: '/home',
      params: form,
    });
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
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.subtitle}>
              Update your details and keep your profile current.
            </Text>

            <Text style={styles.label}>Full name</Text>
            <TextInput
              value={form.name}
              onChangeText={function (value) {
                updateField('name', value);
              }}
              placeholder="Full name"
              placeholderTextColor={isDark ? '#8FA3B7' : '#6A7C8F'}
              style={styles.input}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput value={form.email} editable={false} style={styles.disabledInput} placeholder='Email'/>

            <Text style={styles.label}>Age</Text>
            <TextInput
              value={form.age}
              onChangeText={function (value) {
                updateField('age', value);
              }}
              keyboardType="numeric"
              placeholder="Age"
              placeholderTextColor={isDark ? '#8FA3B7' : '#6A7C8F'}
              style={styles.input}
            />

            <Text style={styles.label}>Role</Text>
            <TextInput
              value={form.role}
              onChangeText={function (value) {
                updateField('role', value);
              }}
              placeholder="What kind of support do you offer or seek?"
              placeholderTextColor={isDark ? '#8FA3B7' : '#6A7C8F'}
              style={styles.input}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              value={form.description}
              onChangeText={function (value) {
                updateField('description', value);
              }}
              multiline
              placeholder="Tell people a bit about yourself"
              placeholderTextColor={isDark ? '#8FA3B7' : '#6A7C8F'}
              style={styles.descriptionInput}
            />

            <View style={styles.buttonRow}>
              <Pressable
                onPress={handleSave}
                style={function ({ pressed }) {
                  return [
                    styles.primaryButton,
                    pressed ? styles.primaryButtonPressed : null,
                  ];
                }}
                disabled={saving}
              >
                <Text style={styles.primaryButtonText}>
                  {saving ? 'Saving...' : 'Save changes'}
                </Text>
              </Pressable>

              <Pressable
                onPress={handleBackHome}
                style={function ({ pressed }) {
                  return [
                    styles.secondaryButton,
                    pressed ? styles.secondaryButtonPressed : null,
                  ];
                }}
              >
                <Text style={styles.secondaryButtonText}>Back home</Text>
              </Pressable>
            </View>
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
    maxWidth: 620,
    borderRadius: 24,
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
  disabledInput: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 8,
    color: '#AFC3D6',
    backgroundColor: '#1A1718',
    borderColor: '#3D8FB3',
  },
  descriptionInput: {
    minHeight: 120,
    textAlignVertical: 'top',
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
    backgroundColor: '#FC9E4F',
  },
  primaryButtonPressed: {
    opacity: 0.92,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202C59',
  },
  secondaryButton: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 10,
    backgroundColor: '#231F20',
    borderColor: '#3D8FB3',
  },
  secondaryButtonPressed: {
    opacity: 0.92,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F4FAFF',
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
    maxWidth: 620,
    borderRadius: 24,
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
  disabledInput: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 8,
    color: '#6A7C8F',
    backgroundColor: '#F1F6FB',
    borderColor: '#3D8FB3',
  },
  descriptionInput: {
    minHeight: 120,
    textAlignVertical: 'top',
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
    backgroundColor: '#FC9E4F',
  },
  primaryButtonPressed: {
    opacity: 0.92,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202C59',
  },
  secondaryButton: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderColor: '#3D8FB3',
  },
  secondaryButtonPressed: {
    opacity: 0.92,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202C59',
  },
});