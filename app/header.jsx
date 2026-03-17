import { FontAwesome5 } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Feed', href: '/feed' },
  { label: 'Messages', href: '/messages' },
  { label: 'Profile', href: '/profile' },
  { label: 'Chatbot', href: '/chatbot' },
  { label: 'Login', href: '/login' },
  { label: 'Sign up', href: '/signup' },
];

export default function Header({ mode = 0 }) {
  const pathname = usePathname();
  const styles = mode === 0 ? dark : light;
  const [menuOpen, setMenuOpen] = useState(false);

  const isCompact = useMemo(
    () => pathname?.startsWith('/chat/'),
    [pathname]
  );

  function goTo(path) {
    setMenuOpen(false);
    router.push(path);
  }

  return (
    <View style={[styles.wrap, isCompact && styles.wrapCompact]}>
      <Pressable onPress={() => goTo('/')} style={styles.brand}>
        <View style={styles.logoShell}>
          <Image
            source={require('../assets/images/HidushLogo.png')}
            style={styles.logo}
          />
        </View>

        <View>
          <Text style={styles.brandText}>Hidush</Text>
          {!isCompact ? (
            <Text style={styles.brandSubText}>A wider path forward</Text>
          ) : null}
        </View>
      </Pressable>

      <View style={styles.rightSide}>
        {!isCompact ? (
          <View style={styles.desktopNav}>
            {NAV_ITEMS.slice(0, 5).map((item) => {
              const active = pathname === item.href;
              return (
                <Pressable
                  key={item.href}
                  onPress={() => goTo(item.href)}
                  style={[
                    styles.desktopLink,
                    active && styles.desktopLinkActive,
                  ]}
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
        ) : null}

        <Pressable
          onPress={() => setMenuOpen((prev) => !prev)}
          style={styles.menuButton}
        >
          <FontAwesome5
            name={menuOpen ? 'times' : 'bars'}
            size={22}
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
    paddingTop: 42,
    paddingHorizontal: 20,
  },
  wrapCompact: {
    paddingTop: 34,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '70%',
  },
  logoShell: {
    marginRight: 12,
  },
  logo: {
    width: 72,
    height: 72,
    resizeMode: 'contain',
  },
  brandText: {
    fontSize: 31,
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
  desktopLinkActive: {},
  desktopLinkText: {
    fontSize: 15,
    fontWeight: '600',
  },
  desktopLinkTextActive: {},
  menuButton: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdown: {
    position: 'absolute',
    top: 56,
    right: 0,
    width: 190,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 8,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  menuItemActive: {},
  menuText: {
    fontSize: 15,
    fontWeight: '600',
  },
  menuTextActive: {},
};

const dark = StyleSheet.create({
  ...base,
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
  menuItem: {
    ...base.menuItem,
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
    backgroundColor: 'rgba(255,255,255,0.88)',
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
  menuItem: {
    ...base.menuItem,
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