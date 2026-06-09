import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { User, ChevronLeft } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { TEXT } from '@/constants/text';

export default function AppHeader() {
  const { theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  // Determine which screen we're on
  const getScreenInfo = () => {
    if (pathname === '/wishlist') {
      return { title: TEXT.wishlist.title, subtitle: TEXT.wishlist.subtitle };
    } else if (pathname === '/savings') {
      return { title: TEXT.history.title, subtitle: TEXT.history.subtitle };
    } else if (pathname === '/history') {
      return { title: TEXT.history.title, subtitle: TEXT.history.subtitle };
    } else if (pathname === '/profile') {
      return { title: TEXT.profile.title, subtitle: TEXT.profile.subtitle };
    } else {
      return { title: TEXT.calculate.title, subtitle: TEXT.calculate.subtitle };
    }
  };

  const screenInfo = getScreenInfo();
  const isProfileScreen = pathname === '/profile';

  const dynamicStyles = StyleSheet.create({
    container: {
      paddingBottom: 16,
      paddingHorizontal: 22,
      paddingTop: Platform.OS === 'ios' ? 64 : 44,
      zIndex: 100,
    },
    headerContent: {
      alignItems: 'flex-start',
      flexDirection: 'row-reverse', // Persian layout: title right, action left
      gap: 14,
      justifyContent: 'space-between',
    },
    iconButton: {
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      height: 46,
      justifyContent: 'center',
      marginTop: 4,
      width: 46,
      ...theme.shadows.small,
    },
  });

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.headerContent}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{screenInfo.title}</Text>
          {screenInfo.subtitle && (
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              {screenInfo.subtitle}
            </Text>
          )}
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={dynamicStyles.iconButton}
          onPress={() => (isProfileScreen ? router.back() : router.push('/profile'))}
        >
          {isProfileScreen ? (
            <ChevronLeft size={24} color={theme.colors.text} strokeWidth={2} />
          ) : (
            <User size={22} color={theme.colors.text} strokeWidth={1.8} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontFamily: 'Vazirmatn_400Regular',
    fontSize: 14.5,
    lineHeight: 22,
    marginTop: 6,
    textAlign: 'right',
  },
  title: {
    fontFamily: 'Vazirmatn_700Bold',
    fontSize: 30,
    letterSpacing: -0.5,
    lineHeight: 36,
    textAlign: 'right',
  },
  titleContainer: {
    flex: 1,
  },
});
