import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function Header({ mode = 0 }) {
  const stylesHeader = [stylesHeaderDark, stylesHeaderLight];
  const styles = stylesHeader[mode];

  const [menuOpen, setMenuOpen] = useState(false);
  const [conferenceOpen, setConferenceOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) {
      setConferenceOpen(false);
    }
  }, [menuOpen]);

  return (
    <View style={styles.topBar}>
      <Pressable onPress={() => router.push('/')} style={styles.logoContainer}>
        <View style={styles.logoBackground}>
          <Image
            source={require('../assets/images/HidushLogo.png')}
            style={styles.logo}
          />
        </View>

        <View style={styles.titleWrapper}>
          <Text style={styles.schoolText}>Hidush</Text>
        </View>
      </Pressable>

      <View
        style={styles.menuContainer}
        onMouseLeave={() => {
          setMenuOpen(false);
        }}
      >
        <Pressable
          onPress={() => setMenuOpen((prev) => !prev)}
          style={styles.menuLogo}
        >
          <FontAwesome5 name="bars" size={36} color={styles.icon.color} />
        </Pressable>

        {menuOpen && (
          <View style={styles.dropdown}>
            <MenuItem
              title="Home"
              icon="home"
              onPress={() => router.push('/')}
              styles={styles}
            />

            <Pressable
              onPress={() => setConferenceOpen((prev) => !prev)}
              style={styles.menuItem}
            >
              <View style={styles.menuRow}>
                <View style={styles.menuLeft}>
                  <FontAwesome5
                    name="university"
                    size={16}
                    color={styles.icon.color}
                  />
                  <Text style={styles.menuText}>Menu</Text>
                </View>

                <FontAwesome5
                  name={conferenceOpen ? 'chevron-down' : 'chevron-right'}
                  size={12}
                  color={styles.icon.color}
                />
              </View>
            </Pressable>

            {conferenceOpen && (
              <View style={styles.subMenu}>
                <SubMenuItem
                  title="Chatbot"
                  onPress={() => router.push('/chatbot')}
                  styles={styles}
                />
                <SubMenuItem
                  title="Temp-Pg2"
                  onPress={() => router.push('/pg2')}
                  styles={styles}
                />
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const MenuItem = ({ title, icon, onPress, styles }) => (
  <Pressable style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuLeft}>
      <FontAwesome5 name={icon} size={16} color={styles.icon.color} />
      <Text style={styles.menuText}>{title}</Text>
    </View>
  </Pressable>
);

const SubMenuItem = ({ title, onPress, styles }) => (
  <Pressable style={styles.subMenuItem} onPress={onPress}>
    <Text style={styles.subMenuText}>{title}</Text>
  </Pressable>
);

export const stylesHeaderDark = StyleSheet.create({
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 45,
    paddingHorizontal: 25,
  },

  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoBackground: {
    padding: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },

  logo: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
  },

  titleWrapper: {
    paddingLeft: 15,
  },

  schoolText: {
    fontFamily: 'Times New Roman',
    fontSize: 35,
    color: '#F4FAFF',
    fontWeight: 'bold',
  },

  menuContainer: {
    position: 'relative',
  },

  menuLogo: {
    padding: 10,
  },

  dropdown: {
    position: 'absolute',
    top: 50,
    right: 0,
    width: 280,
    backgroundColor: 'rgba(32, 44, 89, 0.95)',
    borderRadius: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#3D8FB3',
  },

  menuItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  menuText: {
    color: '#F4FAFF',
    fontSize: 16,
    marginLeft: 12,
  },

  subMenu: {
    paddingLeft: 40,
    backgroundColor: 'rgba(61, 143, 179, 0.12)',
  },

  subMenuItem: {
    paddingVertical: 10,
  },

  subMenuText: {
    color: '#DEFFFE',
    fontSize: 15,
    opacity: 0.9,
  },

  icon: {
    color: '#FC9E4F',
  },
});

export const stylesHeaderLight = StyleSheet.create({
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 45,
    paddingHorizontal: 25,
  },

  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoBackground: {
    padding: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },

  logo: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
  },

  titleWrapper: {
    paddingLeft: 15,
  },

  schoolText: {
    fontFamily: 'Times New Roman',
    fontSize: 35,
    color: '#202C59',
    fontWeight: 'bold',
  },

  menuContainer: {
    position: 'relative',
  },

  menuLogo: {
    padding: 10,
  },

  dropdown: {
    position: 'absolute',
    top: 50,
    right: 0,
    width: 280,
    backgroundColor: '#F4FAFF',
    borderRadius: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#3D8FB3',
  },

  menuItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  menuText: {
    color: '#202C59',
    fontSize: 16,
    marginLeft: 12,
  },

  subMenu: {
    paddingLeft: 40,
    backgroundColor: 'rgba(61, 143, 179, 0.10)',
  },

  subMenuItem: {
    paddingVertical: 10,
  },

  subMenuText: {
    color: '#3D8FB3',
    fontSize: 15,
  },

  icon: {
    color: '#FC9E4F',
  },
});