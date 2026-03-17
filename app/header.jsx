import { FontAwesome5 } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Log In', href: '/login' },
  { label: 'Sign Up', href: '/signup' },
  { label: 'Messages', href: '/messages' },
  { label: 'Profile', href: '/profile' },
];

export default function Header({ mode = 0 }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isDark = mode === 0;

  function goTo(path) {
    setMenuOpen(false);
    router.push(path);
  }

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 40,
        paddingHorizontal: 20,
      }}
    >
      {/* LEFT SIDE */}
      <Pressable
        onPress={() => goTo('/')}
        style={{ flexDirection: 'row', alignItems: 'center', maxWidth: '70%' }}
      >
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 18,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
            backgroundColor: isDark ? '#231F20' : '#FFFFFF',
            borderWidth: 1,
            borderColor: '#3D8FB3',
          }}
        >
          <Image
            source={require('../assets/images/HidushLogo.png')} 
            style={{ width: '100%', height: '100%' }}
            resizeMode="contain"
          />
        </View>

        <View>
          <Text
            style={{
              fontSize: 28,
              fontWeight: '800',
              color: isDark ? '#F4FAFF' : '#202C59',
            }}
          >
            Hidush
          </Text>
          <Text
            style={{
              fontSize: 13,
              marginTop: 2,
              color: isDark ? '#DEFFFE' : '#202C59',
            }}
          >
            Support without boundaries
          </Text>
        </View>
      </Pressable>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;

            return (
              <Pressable
                key={item.href}
                onPress={() => goTo(item.href)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderRadius: 12,
                  marginRight: 6,
                  backgroundColor: isDark
                    ? 'rgba(32,44,89,0.6)'
                    : 'rgba(255,255,255,0.9)',
                  borderWidth: active ? 1 : 0,
                  borderColor: '#3D8FB3',
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '600',
                    color: active
                      ? '#FC9E4F'
                      : isDark
                      ? '#F4FAFF'
                      : '#202C59',
                  }}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* MENU BUTTON */}
        <Pressable
          onPress={() => setMenuOpen((prev) => !prev)}
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isDark
              ? 'rgba(32,44,89,0.9)'
              : 'rgba(255,255,255,0.92)',
            borderWidth: 1,
            borderColor: '#3D8FB3',
          }}
        >
          <FontAwesome5
            name={menuOpen ? 'times' : 'bars'}
            size={20}
            color={isDark ? '#F4FAFF' : '#202C59'}
          />
        </Pressable>

        {/* DROPDOWN */}
        {menuOpen && (
          <View
            style={{
              position: 'absolute',
              top: 54,
              right: 0,
              width: 180,
              borderRadius: 16,
              borderWidth: 1,
              paddingVertical: 8,
              backgroundColor: isDark
                ? 'rgba(32,44,89,0.97)'
                : 'rgba(255,255,255,0.98)',
              borderColor: '#3D8FB3',
            }}
          >
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;

              return (
                <Pressable
                  key={item.href}
                  onPress={() => goTo(item.href)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 13,
                    backgroundColor: active
                      ? isDark
                        ? 'rgba(252,158,79,0.12)'
                        : 'rgba(61,143,179,0.08)'
                      : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '600',
                      color: active
                        ? isDark
                          ? '#FC9E4F'
                          : '#3D8FB3'
                        : isDark
                        ? '#F4FAFF'
                        : '#202C59',
                    }}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
}