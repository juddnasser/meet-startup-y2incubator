import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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
                    {/* add img here */}
                </View>

                <View style={{ paddingLeft: 15 }}>
                    <Text style={styles.schoolText}>TEMP{'\n'}NAME{'\n'}PLACEHOLDER</Text>
                </View>
            </Pressable>

            <View
                style={styles.menuContainer}
                onMouseLeave={() => {
                    setMenuOpen(false);
                }}
            >
                <Pressable onPress={() => setMenuOpen(prev => !prev)} style={styles.menuLogo}>
                    <FontAwesome5 name="bars" size={36} color={styles.icon.color} />
                </Pressable>

                {menuOpen && (
                    <View style={styles.dropdown}>
                        <MenuItem title="Home" icon="home" onPress={() => router.push('/')} styles={styles} />

                        <Pressable onPress={() => setConferenceOpen(prev => !prev)} style={styles.menuItem}>
                            <View style={styles.menuRow}>
                                <View style={styles.menuLeft}>
                                    <FontAwesome5 name="university" size={16} color={styles.icon.color} />
                                    <Text style={styles.menuText}>Tmpe</Text>
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
                                <SubMenuItem title="Chatbot" onPress={() => router.push('/chatbot')} styles={styles} />
                                <SubMenuItem title="Temp-Pg2" onPress={() => router.push('/pg2')} styles={styles} />
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
    topBar: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 9999, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 45, paddingHorizontal: 25 },
    logoContainer: { flexDirection: 'row', alignItems: 'center' },
    logoBackground: { backgroundColor: 'white', borderRadius: 20, padding: 8, elevation: 5 },
    schoolText: { fontFamily: 'Times New Roman', fontSize: 23, color: '#FFFFFF', fontWeight: 'bold' },

    menuContainer: { position: 'relative' },
    menuLogo: { padding: 10 },
    dropdown: { position: 'absolute', top: 50, right: 0, width: 280, backgroundColor: 'rgba(0,0,0,0.9)', borderRadius: 10, paddingVertical: 10 },
    menuItem: { paddingHorizontal: 20, paddingVertical: 16 },
    menuRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    menuLeft: { flexDirection: 'row', alignItems: 'center' },
    menuText: { color: '#FFFFFF', fontSize: 16, marginLeft: 12 },

    subMenu: { paddingLeft: 40, backgroundColor: 'rgba(255,255,255,0.05)' },
    subMenuItem: { paddingVertical: 10 },
    subMenuText: { color: '#FFFFFF', fontSize: 15, opacity: 0.85 },

    icon: { color: '#FFFFFF' },
});

export const stylesHeaderLight = StyleSheet.create({
    topBar: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 9999, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 45, paddingHorizontal: 25 },
    logoContainer: { flexDirection: 'row', alignItems: 'center' },
    logoBackground: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 8, elevation: 5 },
    schoolText: { fontFamily: 'Times New Roman', fontSize: 23, color: '#020617', fontWeight: 'bold' },

    menuContainer: { position: 'relative' },
    menuLogo: { padding: 10 },
    dropdown: { position: 'absolute', top: 50, right: 0, width: 280, backgroundColor: '#FFFFFF', borderRadius: 10, paddingVertical: 10, borderWidth: 1, borderColor: '#CBD5E1' },
    menuItem: { paddingHorizontal: 20, paddingVertical: 16 },
    menuRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    menuLeft: { flexDirection: 'row', alignItems: 'center' },
    menuText: { color: '#020617', fontSize: 16, marginLeft: 12 },

    subMenu: { paddingLeft: 40, backgroundColor: '#F1F5F9' },
    subMenuItem: { paddingVertical: 10 },
    subMenuText: { color: '#334155', fontSize: 15 },

    icon: { color: '#020617' },
});
