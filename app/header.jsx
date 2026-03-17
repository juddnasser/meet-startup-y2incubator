import { FontAwesome5 } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Log In', href: '/login' },
  { label: 'Sign Up', href: '/signup' },
  { label: 'Messages', href: '/messages' },
  { label: 'Profile', href: '/profile' },
];

export default function Header({ mode = 0 }) {
  const pathname = usePathname();
  const styles = mode === 0 ? dark : light;
  const [menuOpen, setMenuOpen] = useState(false);

  function goTo(path) {
    setMenuOpen(false);
    router.push(path);
  }

  return (
    <View style={styles.wrap}>
      <Pressable onPress={() => goTo('/')} style={styles.brand}>
        <View style={styles.logoFallback}>
          <Text style={styles.logoFallbackText}>H</Text>
        </View>

        <View>
          <Text style={styles.brandText}>Hidush</Text>
          <Text style={styles.brandSubText}>Support that opens doors</Text>
        </View>
      </Pressable>

      <View style={styles.rightSide}>
        <View style={styles.desktopNav}>
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Pressable
                key={item.href}
                onPress={() => goTo(item.href)}
                style={[styles.desktopLink, active && styles.desktopLinkActive]}
              >
                <Text
                  style={[
                    styles.desktopLinkText,
                    active && styles.desktopLinkTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          onPress={() => setMenuOpen((prev) => !prev)}
          style={styles.menuButton}
        >
          <FontAwesome5
            name={menuOpen ? 'times' : 'bars'}
            size={20}
            color={mode === 0 ? '#F4FAFF' : '#202C59'}
          />
        </Pressable>

        {menuOpen ? (
          <View style={styles.dropdown}>
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Pressable
                  key={item.href}
                  onPress={() => goTo(item.href)}
                  style={[styles.menuItem, active && styles.menuItemActive]}
                >
                  <Text
                    style={[styles.menuText, active && styles.menuTextActive]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}
      </View>
    </View>
  );
}

const base = {
  wrap: {
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
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '70%',
  },
  logoFallback: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoFallbackText: {
    fontSize: 28,
    fontWeight: '800',
  },
  brandText: {
    fontSize: 28,
    fontWeight: '800',
  },
  brandSubText: {
    fontSize: 13,
    marginTop: 2,
  },
  rightSide: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  desktopNav: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  desktopLink: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 6,
  },
  desktopLinkText: {
    fontSize: 15,
    fontWeight: '600',
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdown: {
    position: 'absolute',
    top: 54,
    right: 0,
    width: 180,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 8,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  menuText: {
    fontSize: 15,
    fontWeight: '600',
  },
};

const dark = StyleSheet.create({
  ...base,
  logoFallback: {
    ...base.logoFallback,
    backgroundColor: '#231F20',
    borderWidth: 1,
    borderColor: '#3D8FB3',
  },
  logoFallbackText: {
    ...base.logoFallbackText,
    color: '#FC9E4F',
  },
  brandText: {
    ...base.brandText,
    color: '#F4FAFF',
  },
  brandSubText: {
    ...base.brandSubText,
    color: '#DEFFFE',
  },
  desktopLink: {
    ...base.desktopLink,
    backgroundColor: 'rgba(32, 44, 89, 0.52)',
  },
  desktopLinkActive: {
    borderWidth: 1,
    borderColor: '#3D8FB3',
    backgroundColor: 'rgba(32, 44, 89, 0.9)',
  },
  desktopLinkText: {
    ...base.desktopLinkText,
    color: '#F4FAFF',
  },
  desktopLinkTextActive: {
    color: '#FC9E4F',
  },
  menuButton: {
    ...base.menuButton,
    backgroundColor: 'rgba(32, 44, 89, 0.9)',
    borderWidth: 1,
    borderColor: '#3D8FB3',
  },
  dropdown: {
    ...base.dropdown,
    backgroundColor: 'rgba(32, 44, 89, 0.97)',
    borderColor: '#3D8FB3',
  },
  menuItemActive: {
    backgroundColor: 'rgba(252, 158, 79, 0.12)',
  },
  menuText: {
    ...base.menuText,
    color: '#F4FAFF',
  },
  menuTextActive: {
    color: '#FC9E4F',
  },
});

const light = StyleSheet.create({
  ...base,
  logoFallback: {
    ...base.logoFallback,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#3D8FB3',
  },
  logoFallbackText: {
    ...base.logoFallbackText,
    color: '#202C59',
  },
  brandText: {
    ...base.brandText,
    color: '#202C59',
  },
  brandSubText: {
    ...base.brandSubText,
    color: '#202C59',
  },
  desktopLink: {
    ...base.desktopLink,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(61, 143, 179, 0.3)',
  },
  desktopLinkActive: {
    borderWidth: 1,
    borderColor: '#3D8FB3',
    backgroundColor: '#FFFFFF',
  },
  desktopLinkText: {
    ...base.desktopLinkText,
    color: '#202C59',
  },
  desktopLinkTextActive: {
    color: '#3D8FB3',
  },
  menuButton: {
    ...base.menuButton,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1,
    borderColor: '#3D8FB3',
  },
  dropdown: {
    ...base.dropdown,
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderColor: '#3D8FB3',
  },
  menuItemActive: {
    backgroundColor: 'rgba(61, 143, 179, 0.08)',
  },
  menuText: {
    ...base.menuText,
    color: '#202C59',
  },
  menuTextActive: {
    color: '#3D8FB3',
  },
});